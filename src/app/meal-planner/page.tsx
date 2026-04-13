"use client";

import { useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateAIMealPlan, type GenerateAIMealPlanOutput } from "@/ai/flows/generate-ai-meal-plan";
import { ArrowLeft, Loader2, Sparkles, ChefHat, Info } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function MealPlanner() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GenerateAIMealPlanOutput | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    dietaryPreferences: "Vegetarian",
    healthGoals: "Weight Loss",
    healthConditions: "",
    language: "English"
  });

  const generatePlan = async () => {
    setLoading(true);
    try {
      const result = await generateAIMealPlan(formData);
      setPlan(result);
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate your meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        <h1 className="text-xl font-headline font-bold">Smart Meal Planner</h1>
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-8">
        {!plan ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <ChefHat size={32} />
              </div>
              <h2 className="text-3xl font-headline font-bold">Personalized AI Recipes</h2>
              <p className="text-muted-foreground max-w-md mx-auto">Tell us about your preferences and our AI coach will craft a traditional 3-day Indian meal plan just for you.</p>
            </div>

            <Card className="border-none shadow-xl bg-white overflow-hidden">
              <div className="h-2 bg-primary" />
              <CardContent className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Dietary Preference</Label>
                    <Select defaultValue="Vegetarian" onValueChange={(v) => setFormData({...formData, dietaryPreferences: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="Vegan">Vegan</SelectItem>
                        <SelectItem value="Low-Carb">Low-Carb (Keto)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Health Goal</Label>
                    <Select defaultValue="Weight Loss" onValueChange={(v) => setFormData({...formData, healthGoals: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                        <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                        <SelectItem value="Diabetes Management">Diabetes Management</SelectItem>
                        <SelectItem value="General Wellness">General Wellness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Health Conditions (Optional)</Label>
                  <Input 
                    placeholder="e.g. PCOS, Thyroid, No Nuts, Gluten-free" 
                    onChange={(e) => setFormData({...formData, healthConditions: e.target.value})}
                  />
                  <p className="text-[10px] text-muted-foreground">Mention any allergies or chronic conditions for better accuracy.</p>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Language</Label>
                  <Select defaultValue="English" onValueChange={(v) => setFormData({...formData, language: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Malayalam">Malayalam</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Kannada">Kannada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg font-bold gap-2" 
                  onClick={generatePlan}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  {loading ? "Crafting Your Plan..." : "Generate 3-Day Plan"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-3xl font-headline font-bold">Your Custom Meal Plan</h2>
                <p className="text-muted-foreground">3 Days of Nutritious Indian Meals</p>
              </div>
              <Button variant="outline" onClick={() => setPlan(null)}>Reset Preferences</Button>
            </div>

            <Card className="bg-accent/5 border-none shadow-sm">
              <CardContent className="p-6 flex gap-4 items-start">
                <Info className="text-accent shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4 className="font-bold">Coach's Advice</h4>
                  <p className="text-sm leading-relaxed">{plan.nutritionalAdvice}</p>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="Day 1" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-primary/10 mb-8 p-1 h-14 rounded-2xl">
                {plan.mealPlan.map((dayPlan, i) => (
                  <TabsTrigger 
                    key={i} 
                    value={dayPlan.day} 
                    className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-headline"
                  >
                    {dayPlan.day}
                  </TabsTrigger>
                ))}
              </TabsList>

              {plan.mealPlan.map((dayPlan, i) => (
                <TabsContent key={i} value={dayPlan.day} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <MealCard type="Breakfast" meal={dayPlan.meals.breakfast} />
                    <MealCard type="Lunch" meal={dayPlan.meals.lunch} />
                    <MealCard type="Dinner" meal={dayPlan.meals.dinner} />
                    {dayPlan.meals.snacks[0] && <MealCard type="Snack" meal={dayPlan.meals.snacks[0]} />}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="p-6 bg-muted rounded-2xl text-[10px] text-muted-foreground leading-relaxed">
              <strong>Disclaimer:</strong> {plan.disclaimer}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function MealCard({ type, meal }: { type: string, meal: any }) {
  return (
    <Card className="border-none shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow">
      <CardHeader className="bg-primary/5 py-4 px-6 border-b border-primary/5">
        <div className="flex justify-between items-center">
          <Badge className="bg-primary text-white border-none">{type}</Badge>
          <span className="text-xs font-bold text-primary">{meal.calories} kcal</span>
        </div>
        <CardTitle className="text-xl font-headline pt-2">{meal.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <p className="text-sm text-muted-foreground">{meal.description}</p>
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Key Ingredients</p>
          <div className="flex flex-wrap gap-2">
            {meal.ingredients.map((ing: string, i: number) => (
              <Badge key={i} variant="secondary" className="text-[10px] bg-secondary/50 text-secondary-foreground">{ing}</Badge>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <MacroStat label="Prot" val={`${meal.macronutrients.protein}g`} />
          <MacroStat label="Carb" val={`${meal.macronutrients.carbohydrates}g`} />
          <MacroStat label="Fat" val={`${meal.macronutrients.fats}g`} />
        </div>
      </CardContent>
    </Card>
  );
}

function MacroStat({ label, val }: { label: string, val: string }) {
  return (
    <div className="text-center">
      <p className="text-[9px] font-bold uppercase text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{val}</p>
    </div>
  );
}