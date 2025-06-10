"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Ene",
    "Pomada 30g": 4000,
    "Pomada 60g": 2400,
    "Pomada 90g": 2400,
  },
  {
    name: "Feb",
    "Pomada 30g": 3000,
    "Pomada 60g": 1398,
    "Pomada 90g": 2210,
  },
  {
    name: "Mar",
    "Pomada 30g": 2000,
    "Pomada 60g": 9800,
    "Pomada 90g": 2290,
  },
  {
    name: "Abr",
    "Pomada 30g": 2780,
    "Pomada 60g": 3908,
    "Pomada 90g": 2000,
  },
  {
    name: "May",
    "Pomada 30g": 1890,
    "Pomada 60g": 4800,
    "Pomada 90g": 2181,
  },
  {
    name: "Jun",
    "Pomada 30g": 2390,
    "Pomada 60g": 3800,
    "Pomada 90g": 2500,
  },
  {
    name: "Jul",
    "Pomada 30g": 3490,
    "Pomada 60g": 4300,
    "Pomada 90g": 2100,
  },
]

export function SalesChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis dataKey="name" stroke={isDark ? "#888" : "#333"} />
        <YAxis stroke={isDark ? "#888" : "#333"} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#333" : "#fff",
            color: isDark ? "#fff" : "#333",
            border: `1px solid ${isDark ? "#444" : "#ddd"}`,
          }}
        />
        <Legend />
        <Bar dataKey="Pomada 30g" fill="#22c55e" /> {/* Verde */}
        <Bar dataKey="Pomada 60g" fill="#dc2626" /> {/* Rojo */}
        <Bar dataKey="Pomada 90g" fill="#86efac" /> {/* Verde claro */}
      </BarChart>
    </ResponsiveContainer>
  )
}
