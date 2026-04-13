"use client";

import { useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractLabReportMarkers, type ExtractLabReportMarkersOutput } from "@/ai/flows/extract-lab-report-markers-flow";
import { ArrowLeft, FileText, Loader2, Upload, Calendar, User, Activity, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function LabReports() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ExtractLabReportMarkersOutput | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setLoading(true);
        try {
          const result = await extractLabReportMarkers({ pdfDataUri: reader.result as string });
          setReport(result);
        } catch (error) {
          toast({
            title: "Analysis failed",
            description: "Could not parse the PDF. Ensure it's a valid lab report.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <header className="px-6 py-6 border-b bg-white flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-headline font-bold">Lab Report Insights</h1>
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-8">
        {!report ? (
          <div className="text-center space-y-8 py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
              <FileText size={40} />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-headline font-bold">Automated Analysis</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">Upload your blood reports (Thyrocare, Lal PathLabs) to sync health markers with your diet plan.</p>
            </div>

            <Card className="max-w-md mx-auto border-none shadow-xl bg-white overflow-hidden">
               <div className="p-10 flex flex-col items-center gap-6">
                  {loading ? (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <Loader2 className="animate-spin text-primary" size={48} />
                      <p className="font-headline font-bold text-primary animate-pulse">Extracting Markers...</p>
                    </div>
                  ) : (
                    <label className="w-full cursor-pointer">
                      <div className="border-2 border-dashed border-primary/20 rounded-2xl p-8 hover:bg-primary/5 transition-colors flex flex-col items-center gap-3">
                        <Upload className="text-primary/40" size={32} />
                        <span className="font-semibold text-primary">Choose PDF Report</span>
                        <span className="text-xs text-muted-foreground">Max file size: 10MB</span>
                      </div>
                      <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
                    </label>
                  )}
               </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-3xl font-headline font-bold">Extracted Markers</h2>
                <div className="flex items-center gap-4 text-muted-foreground text-sm mt-1">
                  <span className="flex items-center gap-1"><User size={14} /> {report.patientName || 'N/A'}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {report.reportDate || 'N/A'}</span>
                  <span className="flex items-center gap-1"><Activity size={14} /> {report.reportType}</span>
                </div>
              </div>
              <Button variant="outline" onClick={() => setReport(null)}>Upload Another</Button>
            </div>

            <Card className="bg-primary/5 border-none">
              <CardContent className="p-6 space-y-2">
                <h4 className="font-bold flex items-center gap-2"><CheckCircle2 className="text-primary" size={18} /> Executive Summary</h4>
                <p className="text-sm leading-relaxed text-muted-foreground italic">"{report.summary}"</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.extractedMarkers.map((marker, idx) => (
                <MarkerCard key={idx} marker={marker} />
              ))}
            </div>

            <Button className="w-full h-14 text-lg font-bold" onClick={() => toast({ title: "Updated!", description: "Your diet plan has been optimized based on these results." })}>
               Sync with Diet Plan
            </Button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function MarkerCard({ marker }: { marker: any }) {
  const isHigh = marker.interpretation?.toLowerCase().includes('high');
  const isLow = marker.interpretation?.toLowerCase().includes('low');
  
  return (
    <Card className="border-none shadow-md bg-white overflow-hidden">
      <CardContent className="p-5 flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isHigh || isLow ? 'bg-accent/10 text-accent' : 'bg-green-500/10 text-green-600'}`}>
          {isHigh || isLow ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-base leading-tight">{marker.name}</h4>
            <Badge className={`${isHigh || isLow ? 'bg-accent text-white' : 'bg-green-500 text-white'} border-none text-[10px]`}>
              {marker.interpretation || 'Normal'}
            </Badge>
          </div>
          <div className="flex items-baseline gap-1">
             <span className="text-2xl font-black text-foreground">{marker.value}</span>
             <span className="text-xs text-muted-foreground font-medium">{marker.unit}</span>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium">Ref Range: {marker.referenceRange}</p>
        </div>
      </CardContent>
    </Card>
  );
}