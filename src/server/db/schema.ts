// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { index, serial, text, pgTable, customType } from "drizzle-orm/pg-core"
import { z } from "zod"

const alergiesPgType = customType({
  dataType: () =>
  {
    return "jsonb"
  },

  fromDriver: () =>
  {
    z.array(
      z.object({
        name: z.string(),
        additionalInfo: z.string(),
      }),
    )
  },

  toDriver: (value: any) =>
  {
    return JSON.stringify(value)
  },
})

const medicalConditionsPgType = customType({
  dataType: () =>
  {
    return "jsonb"
  },

  fromDriver: () =>
  {
    z.array(
      z.object({
        name: z.string(),
        additionalInfo: z.string(),
      }),
    )
  },

  toDriver: (value: any) =>
  {
    return JSON.stringify(value)
  },
})

const vitalSignsPgType = customType({
  dataType: () =>
  {
    return "jsonb"
  },

  fromDriver: () =>
  {
    z.array(
      z.object({
        name: z.string(),
        value: z.string(),
      }),
    )
  },

  toDriver: (value: any) =>
  {
    return JSON.stringify(value)
  },
})

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  birthDate: text("birth_date").notNull(),
  phoneNumber: text("phone_number").notNull(),
  bloodType: text("blood_type").notNull(),
  alergies: alergiesPgType("alergies").notNull(),
  medicalConditions: medicalConditionsPgType("medical_conditions").notNull(),
  vitalSigns: vitalSignsPgType("vital_signs").notNull(),
})
