export interface Alergy
{
  name: string
  additionalInfo: string
}

export interface MedicalCondition
{
  name: string
  additionalInfo: string
}

export interface VitalSign
{
  bloodPressure: string
  temperature: string
  heartRate: string
  respiratoryRate: string
  spo2: string
  pain: string
}

export interface VitalSignsReading {
  vitalSign: VitalSign,
  time: Date,
}

export interface Patient
{
  uuid: string
  firstName: string
  lastName: string
  birthDate: string
  phoneNumber: string
  bloodType: string
  alergies: Alergy[]
  medicalConditions: MedicalCondition[]
  vitalSigns: VitalSignsReading[]
  notes: string
}

export const patients: Patient[] = [
  {
    uuid: "01JVKSJB6XAZM0RKYAFJFWZKPT",
    firstName: "Juan",
    lastName: "Perez",
    birthDate: "1990-08-21",
    phoneNumber: "8183017441",
    bloodType: "A+",
    alergies: [],
    medicalConditions: [],
    vitalSigns: [],
    notes: "",
  },
  {
    uuid: "01JVKSJGWABT7E82NWA0PRYG1P",
    firstName: "Emilio",
    lastName: "González Rodríguez",
    birthDate: "2001-12-27",
    phoneNumber: "812419467",
    bloodType: "O-",
    alergies: [],
    medicalConditions: [],
    vitalSigns: [],
    notes: "",
  },
]

export const users = [
  {
    username: "1868769",
    password: "hunter2",
  },
  {
    username: "3671027",
    password: "bluesky10",
  },
]
