"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const formSchema = z.object({
  // IDENTIFICAÇÃO
  be: z.string().optional(),
  data: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  idade: z.string().optional(),
  hora_entrada: z.string().optional(),
  local_pn: z.string().optional(),
  tipo_atendimento: z.enum(["Gineco", "Pediatria", "CM", "Puérpera", "VVS"]).optional(),

  // INFORMAÇÕES CLÍNICAS
  queixa_principal: z.string().optional(),
  g: z.string().optional(),
  p: z.string().optional(),
  a: z.string().optional(),
  ig: z.string().optional(),

  // PROCEDIMENTOS
  medicacoes_emergencia: z.string().optional(),
  proc_hgt: z.boolean().default(false),
  proc_hgt_valor: z.string().optional(),
  proc_ctg: z.boolean().default(false),
  proc_exames_lab: z.boolean().default(false),
  proc_medicacao: z.boolean().default(false),
  proc_outros: z.boolean().default(false),
  proc_outros_texto: z.string().optional(),

  // DESTINO
  destino: z.enum(["Liberada", "Transferida", "Internacao"]).optional(),
  destino_transferida_para: z.string().optional(),
  destino_andar: z.string().optional(),
  destino_setor: z.string().optional(),

  // INTERNAÇÃO
  diagnostico_internacao: z.string().optional(),
  diagnostico_por: z.string().optional(),

  // DOSE DE ATAQUE
  hidralazina: z.enum(["Sim", "Não"]).optional(),
  hidralazina_doses: z.string().optional(),
  hidralazina_hora: z.string().optional(),
  mgso4: z.enum(["Sim", "Não"]).optional(),
  mgso4_hora: z.string().optional(),

  // OBSERVAÇÕES
  observacoes: z.string().optional(),

  // PROCEDÊNCIA
  procedencia: z.enum(["Meios Próprios", "Ambulância", "Vaga 0"]).optional(),

  // SINAIS VITAIS
  pa_entrada: z.string().optional(),
  tax: z.string().optional(),
  spo2: z.string().optional(),
  fc: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.proc_outros && !data.proc_outros_texto) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Descreva o procedimento", path: ["proc_outros_texto"] });
  }
  if (data.destino === "Transferida" && !data.destino_transferida_para) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Informe o destino da transferência", path: ["destino_transferida_para"] });
  }
  if (data.hidralazina === "Sim" && !data.hidralazina_doses) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Informe as doses", path: ["hidralazina_doses"] });
  }
  if (data.hidralazina === "Não" && !data.hidralazina_hora) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Informe a hora", path: ["hidralazina_hora"] });
  }
});

export type FormData = z.infer<typeof formSchema>;

interface FormEditorProps {
  defaultValues?: Partial<FormData>;
  formId?: string;
  mode: "create" | "edit";
}

export function FormEditor({ defaultValues, formId, mode }: FormEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      be: "", data: "", nome: "", idade: "", hora_entrada: "", local_pn: "",
      queixa_principal: "", g: "", p: "", a: "", ig: "",
      medicacoes_emergencia: "",
      proc_hgt: false, proc_hgt_valor: "", proc_ctg: false,
      proc_exames_lab: false, proc_medicacao: false, proc_outros: false, proc_outros_texto: "",
      destino_transferida_para: "", destino_andar: "", destino_setor: "",
      diagnostico_internacao: "", diagnostico_por: "",
      hidralazina_doses: "", hidralazina_hora: "", mgso4_hora: "",
      observacoes: "",
      pa_entrada: "", tax: "", spo2: "", fc: "",
      ...defaultValues,
    },
  });

  const watchDestino = form.watch("destino");
  const watchHGT = form.watch("proc_hgt");
  const watchOutros = form.watch("proc_outros");
  const watchHidralazina = form.watch("hidralazina");
  const watchMgSO4 = form.watch("mgso4");

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const url = mode === "edit" ? `/api/forms/${formId}` : "/api/forms";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form_data: data }),
      });

      if (!response.ok) throw new Error();

      toast.success(mode === "edit" ? "Ficha atualizada com sucesso!" : "Ficha criada com sucesso!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error(mode === "edit" ? "Erro ao atualizar ficha" : "Erro ao criar ficha");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* IDENTIFICAÇÃO */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-wide text-muted-foreground">Identificação</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <FormField control={form.control} name="be" render={({ field }) => (
              <FormItem>
                <FormLabel>BE</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="data" render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="hora_entrada" render={({ field }) => (
              <FormItem>
                <FormLabel>Hora entrada emerg.</FormLabel>
                <FormControl><Input type="time" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="nome" render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Nome <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="Nome completo do paciente" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="idade" render={({ field }) => (
              <FormItem>
                <FormLabel>Idade</FormLabel>
                <FormControl><Input type="number" min="0" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="local_pn" render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-3">
                <FormLabel>Local PN</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tipo_atendimento" render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-3">
                <FormLabel>Tipo de Atendimento</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-wrap gap-4 pt-1"
                  >
                    {["Gineco", "Pediatria", "CM", "Puérpera", "VVS"].map((tipo) => (
                      <div key={tipo} className="flex items-center space-x-2">
                        <RadioGroupItem value={tipo} id={`tipo-${tipo}`} />
                        <label htmlFor={`tipo-${tipo}`} className="text-sm cursor-pointer">{tipo}</label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* SINAIS VITAIS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-wide text-muted-foreground">Sinais Vitais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: "pa_entrada" as const, label: "PA de Entrada" },
              { name: "tax" as const, label: "TAX" },
              { name: "spo2" as const, label: "SpO2" },
              { name: "fc" as const, label: "FC" },
            ].map(({ name, label }) => (
              <FormField key={name} control={form.control} name={name} render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl><Input placeholder="—" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            ))}
          </CardContent>
        </Card>

        {/* PROCEDÊNCIA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-wide text-muted-foreground">Procedência</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField control={form.control} name="procedencia" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4">
                    {["Meios Próprios", "Ambulância", "Vaga 0"].map((p) => (
                      <div key={p} className="flex items-center space-x-2">
                        <RadioGroupItem value={p} id={`proc-${p}`} />
                        <label htmlFor={`proc-${p}`} className="text-sm cursor-pointer">{p}</label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* INFORMAÇÕES CLÍNICAS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-wide text-muted-foreground">Informações Clínicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="queixa_principal" render={({ field }) => (
              <FormItem>
                <FormLabel>Queixa Principal</FormLabel>
                <FormControl><Textarea rows={3} className="resize-none" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { name: "g" as const, label: "G" },
                { name: "p" as const, label: "P" },
                { name: "a" as const, label: "A" },
                { name: "ig" as const, label: "IG" },
              ].map(({ name, label }) => (
                <FormField key={name} control={form.control} name={name} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* PROCEDIMENTOS DE EMERGÊNCIA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-wide text-muted-foreground">Procedimentos de Emergência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="medicacoes_emergencia" render={({ field }) => (
              <FormItem>
                <FormLabel>Medicações e horários feitos na emergência</FormLabel>
                <FormControl><Textarea rows={3} className="resize-none" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Separator />
            <p className="text-sm font-medium">Procedimentos realizados</p>

            {/* HGT */}
            <div className="flex flex-wrap items-center gap-3">
              <FormField control={form.control} name="proc_hgt" render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="proc_hgt" />
                  </FormControl>
                  <label htmlFor="proc_hgt" className="text-sm cursor-pointer">HGT</label>
                </FormItem>
              )} />
              {watchHGT && (
                <FormField control={form.control} name="proc_hgt_valor" render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel className="text-sm text-muted-foreground">Valor:</FormLabel>
                    <FormControl><Input className="w-28 h-8" placeholder="mg/dL" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </div>

            {/* CTG, Exames lab, Medicação */}
            {[
              { name: "proc_ctg" as const, label: "CTG" },
              { name: "proc_exames_lab" as const, label: "Exames lab." },
              { name: "proc_medicacao" as const, label: "Medicação" },
            ].map(({ name, label }) => (
              <FormField key={name} control={form.control} name={name} render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id={name} />
                  </FormControl>
                  <label htmlFor={name} className="text-sm cursor-pointer">{label}</label>
                </FormItem>
              )} />
            ))}

            {/* Outros */}
            <div className="space-y-2">
              <FormField control={form.control} name="proc_outros" render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="proc_outros" />
                  </FormControl>
                  <label htmlFor="proc_outros" className="text-sm cursor-pointer">Outros</label>
                </FormItem>
              )} />
              {watchOutros && (
                <FormField control={form.control} name="proc_outros_texto" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Descreva o procedimento (obrigatório)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* DESTINO */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-wide text-muted-foreground">Destino</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="destino" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Liberada" id="dest-liberada" />
                      <label htmlFor="dest-liberada" className="text-sm cursor-pointer">Liberada</label>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Transferida" id="dest-transferida" />
                        <label htmlFor="dest-transferida" className="text-sm cursor-pointer">Transferida para</label>
                      </div>
                      {watchDestino === "Transferida" && (
                        <FormField control={form.control} name="destino_transferida_para" render={({ field }) => (
                          <FormItem className="flex-1 space-y-0">
                            <FormControl><Input placeholder="Destino (obrigatório)" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Internacao" id="dest-internacao" />
                        <label htmlFor="dest-internacao" className="text-sm cursor-pointer">Internação</label>
                      </div>
                      {watchDestino === "Internacao" && (
                        <div className="grid grid-cols-2 gap-4 pl-6">
                          <FormField control={form.control} name="destino_andar" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Andar</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="destino_setor" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Setor</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                      )}
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* INTERNAÇÃO */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-wide text-muted-foreground">Internação</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField control={form.control} name="diagnostico_internacao" render={({ field }) => (
              <FormItem>
                <FormLabel>Diagnóstico de internação</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="diagnostico_por" render={({ field }) => (
              <FormItem>
                <FormLabel>Por</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* DOSE DE ATAQUE */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-wide text-muted-foreground">Dose de Ataque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hidralazina */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Hidralazina</p>
              <FormField control={form.control} name="hidralazina" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sim" id="hid-sim" />
                        <label htmlFor="hid-sim" className="text-sm cursor-pointer">Sim</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Não" id="hid-nao" />
                        <label htmlFor="hid-nao" className="text-sm cursor-pointer">Não</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {watchHidralazina === "Sim" && (
                <FormField control={form.control} name="hidralazina_doses" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doses <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input placeholder="Doses administradas" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              {watchHidralazina === "Não" && (
                <FormField control={form.control} name="hidralazina_hora" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input type="time" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </div>

            <Separator />

            {/* MgSO4 */}
            <div className="space-y-3">
              <p className="text-sm font-medium">MgSO4</p>
              <FormField control={form.control} name="mgso4" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sim" id="mg-sim" />
                        <label htmlFor="mg-sim" className="text-sm cursor-pointer">Sim</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Não" id="mg-nao" />
                        <label htmlFor="mg-nao" className="text-sm cursor-pointer">Não</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {(watchMgSO4 === "Sim" || watchMgSO4 === "Não") && (
                <FormField control={form.control} name="mgso4_hora" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl><Input type="time" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* OBSERVAÇÕES */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-wide text-muted-foreground">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField control={form.control} name="observacoes" render={({ field }) => (
              <FormItem>
                <FormControl><Textarea rows={4} className="resize-none" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <div className="flex gap-4 pb-8">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? "Salvando..." : mode === "edit" ? "Salvar Alterações" : "Criar Ficha"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
