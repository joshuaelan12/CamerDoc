
"use server";

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import type { UserData, Message } from "@/types";

// Get all unique doctors the patient has had an appointment with
export async function getConversations(patientId: string): Promise<UserData[]> {
  try {
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("patientId", "==", patientId)
    );
    const appointmentsSnapshot = await getDocs(appointmentsQuery);

    const doctorIds = new Set<string>();
    appointmentsSnapshot.forEach(doc => {
      doctorIds.add(doc.data().doctorId);
    });

    if (doctorIds.size === 0) {
      return [];
    }

    const usersQuery = query(
      collection(db, "users"),
      where("uid", "in", Array.from(doctorIds))
    );
    const usersSnapshot = await getDocs(usersQuery);

    return usersSnapshot.docs.map(doc => {
        const data = doc.data();
        const userData: UserData = {
            ...data,
            uid: doc.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
            dateOfBirth: data.dateOfBirth?.toDate ? data.dateOfBirth.toDate().toISOString() : null,
        } as UserData;
        return userData;
    });
  } catch (error) {
    console.error("Error fetching conversations: ", error);
    return [];
  }
}

// Get messages for a specific conversation
export async function getMessages(patientId: string, doctorId: string): Promise<Message[]> {
  try {
    const conversationId = [doctorId, patientId].sort().join('_');
    
    const messagesQuery = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("createdAt", "asc")
    );

    const messagesSnapshot = await getDocs(messagesQuery);

    return messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toMillis(),
    })) as Message[];

  } catch (error) {
    console.error("Error fetching messages: ", error);
    // This could be because the index is missing. We return empty array in that case.
    return [];
  }
}


// Send a new message
export async function sendMessage(senderId: string, receiverId: string, text: string) {
  if (!text.trim()) {
    return { success: false, message: "Message cannot be empty." };
  }
  
  try {
    const conversationId = [senderId, receiverId].sort().join('_');
    const createdAt = serverTimestamp();

    const docRef = await addDoc(collection(db, "messages"), {
      conversationId,
      senderId,
      receiverId,
      text,
      createdAt,
    });
    
    // We can't return the server timestamp directly, so we use current date as an approximation for the optimistic update
    const optimisticNewMessage = {
        id: docRef.id,
        conversationId,
        senderId,
        receiverId,
        text,
        createdAt: Date.now()
    }

    return { success: true, message: "Message sent.", newMessage: optimisticNewMessage };

  } catch (error) {
    console.error("Error sending message: ", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
