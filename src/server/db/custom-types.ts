import { customType } from "drizzle-orm/pg-core"

export const unixEpochDate = customType<{
  data: Date
  driverData: number
  notNull: true
}>({
  dataType: () => "integer",
  toDriver(value: Date): number
  {
    return Math.floor(value.getTime() / 1000)
  },
  fromDriver(value: number): Date
  {
    return new Date(value * 1000)
  },
})
