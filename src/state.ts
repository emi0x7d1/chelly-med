import { atomWithStorage } from "jotai/utils"
import { type Patient, patients } from "./fixtures"

export const patientsAtom = atomWithStorage<Patient[]>("patients", patients)
