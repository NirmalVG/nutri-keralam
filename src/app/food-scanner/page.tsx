"use client";

import { useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, RefreshCcw, Check, ArrowLeft, Loader2 } from "lucide-react";
import { recognizeFoodFromImage, type RecognizeFoodFromImageOutput } from "@/ai/flows/recognize-food-from-image";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function FoodScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<RecognizeFoodFromImageOutput | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setIsScanning(true);
    try {
      const data = await recognizeFoodFromImage({ imageDataUri: image });
      setResult(data);
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "Could not recognize food items. Please try a clearer image.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      <header className="px-6 py-6 border-b bg-white flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-headline font-bold">Food Recognition</h1>
      </header>

      <main className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-8">
        {!image ? (
          <div className="aspect-[3/4] rounded-[2rem] border-4 border-dashed border-primary/20 flex flex-col items-center justify-center space-y-6 bg-white shadow-inner relative overflow-hidden group">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Camera size={40} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-headline font-semibold">Snap or Upload a Photo</h3>
              <p className="text-muted-foreground px-12">Take a photo of your meal to get instant nutritional data.</p>
            </div>
            <label className="cursor-pointer">
              <Button size="lg" className="h-14 px-8 pointer-events-none">
                <Upload className="mr-2" size={20} /> Choose Image
              </Button>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
              <Image src={image} alt="Uploaded meal" fill className="object-cover" />
              {isScanning && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-4">
                  <div className="relative">
                    <Loader2 className="animate-spin" size={48} />
                    <div className="absolute inset-0 animate-ping opacity-25 rounded-full bg-white" />
                  </div>
                  <p className="font-headline font-bold text-lg tracking-wider uppercase">AI Analysis in Progress...</p>
                </div>
              )}
            </div>

            {!result && !isScanning && (
              <div className="flex gap-4">
                <Button variant="outline" size="lg" className="flex-1" onClick={reset}>
                  <RefreshCcw size={18} className="mr-2" /> Retake
                </Button>
                <Button size="lg" className="flex-1" onClick={handleScan}>
                  Scan Meal
                </Button>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-headline font-bold">Meal Analysis</h2>
                  <Button variant="outline" size="sm" onClick={reset}>Scan New</Button>
                </div>

                <Card className="bg-primary/5 border-primary/10 border-none">
                  <CardContent className="p-6 space-y-4">
                    <p className="text-sm font-medium leading-relaxed italic">"{result.overallAnalysis}"</p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {result.foodItems.map((item, idx) => (
                    <Card key={idx} className="border-none shadow-md overflow-hidden bg-white">
                      <CardContent className="p-0 flex items-stretch">
                        <div className="w-1.5 bg-accent" />
                        <div className="p-5 flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-lg">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">{item.portionSize} • {item.description}</p>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-none">{item.calories} kcal</Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
                            <MacroInfo label="Protein" value={`${item.protein}g`} />
                            <MacroInfo label="Carbs" value={`${item.carbohydrates}g`} />
                            <MacroInfo label="Fat" value={`${item.fat}g`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button className="w-full h-14 text-lg font-bold" onClick={() => toast({ title: "Logged!", description: "Meal has been added to your log." })}>
                  <Check className="mr-2" size={24} /> Log Meal
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function MacroInfo({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}