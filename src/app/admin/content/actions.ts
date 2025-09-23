
"use server";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const announcementSchema = z.object({
    title: z.string().min(1, "Title is required."),
    content: z.string().min(1, "Content is required."),
});

export async function createAnnouncement(data: { title: string; content: string }) {
    const validated = announcementSchema.safeParse(data);
    if (!validated.success) {
        throw new Error("Invalid announcement data.");
    }

    await addDoc(collection(db, "announcements"), {
        ...validated.data,
        createdAt: serverTimestamp(),
        status: 'published', // Default to published for now
    });

    revalidatePath("/admin/content");
}

const faqSchema = z.object({
    question: z.string().min(1, "Question is required."),
    answer: z.string().min(1, "Answer is required."),
    category: z.string().min(1, "Category is required."),
});

export async function createFaq(data: { question: string; answer: string; category: string }) {
    const validated = faqSchema.safeParse(data);
    if (!validated.success) {
        throw new Error("Invalid FAQ data.");
    }
    
    await addDoc(collection(db, "faqs"), {
        ...validated.data,
        status: 'published', // Default to published for now
    });

    revalidatePath("/admin/content");
}
