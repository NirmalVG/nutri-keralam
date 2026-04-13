import { BottomNav } from "@/components/bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Utensils, Camera, Activity, TrendingUp, Calendar, ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-64 flex flex-col">
      {/* Desktop Sidebar (Mock) */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border flex-col p-6 space-y-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Utensils className="text-white" size={20} />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-primary">NutriKeralam</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarLink href="/dashboard" icon={<TrendingUp size={18} />} label="Overview" active />
          <SidebarLink href="/meal-planner" icon={<Calendar size={18} />} label="Meal Planner" />
          <SidebarLink href="/food-scanner" icon={<Camera size={18} />} label="Food Scanner" />
          <SidebarLink href="/lab-reports" icon={<Activity size={18} />} label="Lab Reports" />
          <SidebarLink href="/ai-coach" icon={<MessageSquare size={18} />} label="AI Coach" />
        </nav>

        <div className="p-4 bg-primary/5 rounded-2xl space-y-4">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">Plan: Premium</p>
          <p className="text-sm font-medium">You've reached 85% of your protein goal this week!</p>
          <Button size="sm" className="w-full">View Details</Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-headline font-bold">Namaskaram, Arjun</h1>
            <p className="text-muted-foreground">Here's your nutritional summary for today.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
             <Badge variant="outline" className="px-3 py-1 bg-white border-primary/20 text-primary">
                Day 12 of 30 Goal
             </Badge>
          </div>
        </header>

        {/* Nutritional Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Calories Consumed</CardTitle>
              <Utensils className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,840 <span className="text-sm font-normal text-muted-foreground">/ 2,200</span></div>
              <Progress value={84} className="h-2 mt-3" />
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Protein (g)</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">62 <span className="text-sm font-normal text-muted-foreground">/ 75</span></div>
              <Progress value={82} className="h-2 mt-3 bg-accent/20 accent-accent" />
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Weight Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-2.4 <span className="text-sm font-normal text-muted-foreground">kg this month</span></div>
              <div className="text-xs text-muted-foreground mt-2">Target: 72kg (Current: 78.6kg)</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-headline font-semibold">Today's Meal Plan</h2>
              <Button variant="link" className="text-primary font-semibold p-0">View Planner</Button>
            </div>
            
            <div className="space-y-3">
              <MealRow time="Breakfast" meal="Puttu & Kadala Curry" calories={420} completed />
              <MealRow time="Lunch" meal="Brown Rice, Fish Moilee & Thoran" calories={650} completed />
              <MealRow time="Snack" meal="Banana Fritters (Air Fried)" calories={180} />
              <MealRow time="Dinner" meal="Oats Upma with Vegetables" calories={350} />
            </div>
          </section>

          <section className="space-y-4">
             <div className="flex justify-between items-center">
              <h2 className="text-xl font-headline font-semibold">AI Insights</h2>
              <Badge variant="secondary">Personal Coach</Badge>
            </div>
            <Card className="bg-primary text-white border-none shadow-lg overflow-hidden relative">
               <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
               <CardContent className="p-6 space-y-4">
                  <p className="text-primary-foreground/90 font-medium italic">"Arjun, your iron intake was low yesterday. Consider adding Drumstick leaves (Muringa) to your lunch today. It's rich in iron and pairs perfectly with your planned Fish Moilee."</p>
                  <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90">Chat with Coach</Button>
               </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Camera size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Quick Food Scan</h3>
                    <p className="text-xs text-muted-foreground">Instantly log by taking a photo</p>
                  </div>
                </div>
                <Link href="/food-scanner">
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <ChevronRight />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function SidebarLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MealRow({ time, meal, calories, completed = false }: { time: string, meal: string, calories: number, completed?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between bg-white ${completed ? 'border-primary/20 opacity-80' : 'border-border shadow-sm'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${completed ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">{time}</p>
          <h4 className="font-medium text-foreground">{meal}</h4>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold">{calories} kcal</p>
        {completed && <Badge className="bg-primary/10 text-primary border-none text-[10px] h-4">Logged</Badge>}
      </div>
    </div>
  );
}