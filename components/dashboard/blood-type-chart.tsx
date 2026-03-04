"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BloodTypeData {
  blood_type: string;
  count: number;
}

interface BloodTypeChartProps {
  data: BloodTypeData[];
}

export function BloodTypeChart({ data }: BloodTypeChartProps) {
  const chartData = data.map((item) => ({
    name: item.blood_type,
    count: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos Sanguíneos</CardTitle>
        <CardDescription>
          Distribuição de tipos sanguíneos nos formulários
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
