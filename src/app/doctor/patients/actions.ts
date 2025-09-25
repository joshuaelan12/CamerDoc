
"use server";

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import type { UserData, Appointment } from "@/types";

export type PatientWithLastAppointment = UserData & {
  lastAppointment?: Timestamp;
};

// Get all unique patients the doctor has had an appointment with
export async function getPatientsForDoctor(doctorId: string): Promise<PatientWithLastAppointment[]> {
  try {
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctorId)
    );
    const appointmentsSnapshot = await getDocs(appointmentsQuery);

    if (appointmentsSnapshot.empty) {
      return [];
    }

    const patientAppointmentsMap = new Map<string, Timestamp>();
    appointmentsSnapshot.forEach(doc => {
      const appt = doc.data() as Appointment;
      const existingLastAppt = patientAppointmentsMap.get(appt.patientId);
      if (!existingLastAppt || appt.startTime.toMillis() > existingLastAppt.toMillis()) {
        patientAppointmentsMap.set(appt.patientId, appt.startTime);
      }
    });

    const patientIds = Array.from(patientAppointmentsMap.keys());
    if (patientIds.length === 0) {
      return [];
    }

    const userPromises = [];
    for (let i = 0; i < patientIds.length; i += 30) {
        const chunk = patientIds.slice(i, i + 30);
        const usersQuery = query(
          collection(db, "users"),
          where("uid", "in", chunk)
        );
        userPromises.push(getDocs(usersQuery));
    }

    const userSnapshots = await Promise.all(userPromises);
    const patients: PatientWithLastAppointment[] = [];

    userSnapshots.forEach(snapshot => {
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const patientData: PatientWithLastAppointment = {
                ...data,
                uid: doc.id,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
                dateOfBirth: data.dateOfBirth?.toDate ? data.dateOfBirth.toDate().toISOString() : null,
                lastAppointment: patientAppointmentsMap.get(doc.id),
            } as PatientWithLastAppointment;
            patients.push(patientData);
        });
    });

    // Sort patients by most recent appointment
    patients.sort((a, b) => (b.lastAppointment?.toMillis() || 0) - (a.lastAppointment?.toMillis() || 0));
    
    return patients;

  } catch (error) {
    console.error("Error fetching patients: ", error);
    return [];
  }
}
