
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

    const doctorIdsArray = Array.from(doctorIds);
    const userPromises = [];
    for (let i = 0; i < doctorIdsArray.length; i += 30) {
        const chunk = doctorIdsArray.slice(i, i + 30);
         const usersQuery = query(
            collection(db, "users"),
            where("uid", "in", chunk)
        );
        userPromises.push(getDocs(usersQuery));
    }
    
    const userSnapshots = await Promise.all(userPromises);
    const users: UserData[] = [];
    userSnapshots.forEach(snapshot => {
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const userData: UserData = {
                ...data,
                uid: doc.id,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
                dateOfBirth: data.dateOfBirth?.toDate ? data.dateOfBirth.toDate().toISOString() : null,
            } as UserData;
            users.push(userData);
        });
    });

    return users;
  } catch (error) {
    console.error("Error fetching conversations: ", error);
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

    await addDoc(collection(db, "messages"), {
      conversationId,
      senderId,
      receiverId,
      text,
      createdAt: serverTimestamp(),
    });

    return { success: true, message: "Message sent." };

  } catch (error) {
    console.error("Error sending message: ", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

    