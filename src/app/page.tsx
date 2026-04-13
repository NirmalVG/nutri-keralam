import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Zap, ShieldCheck, Heart, Camera, FileText, Utensils } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-food');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Leaf className="text-white" size={20} />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-primary">NutriKeralam</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </nav>
        <Button variant="outline" className="md:hidden">Menu</Button>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-6 pt-12 pb-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <Zap size={16} />
              AI-Powered Indian Nutrition
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold leading-[1.1] text-foreground">
              Your Health, <br /> <span className="text-primary italic">Deeply Personal.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              NutriKeralam combines ancient Indian wisdom with cutting-edge AI to provide hyper-personalized meal plans, food recognition, and lab report analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg gap-2 w-full sm:w-auto">
                  Start Your Journey <ArrowRight size={20} />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto">
                Explore Database
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-3xl" />
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl">
              <Image 
                src={heroImg?.imageUrl || ''} 
                alt={heroImg?.description || ''} 
                fill 
                className="object-cover"
                data-ai-hint="Indian food"
              />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="bg-white/50 py-24 px-6">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-4xl font-headline font-bold">Comprehensive Wellness Tools</h2>
              <p className="text-muted-foreground">Everything you need to manage your health with the context of Indian cuisine and lifestyle.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Camera className="text-accent" />}
                title="AI Food Scanner"
                description="Snap a photo of your meal. Our AI identifies ingredients and provides instant nutritional data tailored to Indian portion sizes."
              />
              <FeatureCard 
                icon={<ShieldCheck className="text-primary" />}
                title="Condition-Specific Plans"
                description="Tailored nutrition for Diabetes, PCOS, and Thyroid management, following ICMR guidelines and regional tastes."
              />
              <FeatureCard 
                icon={<FileText className="text-orange-500" />}
                title="Automated Lab Analysis"
                description="Upload Thyrocare or Lal PathLabs reports. We parse the markers and adjust your diet plan automatically."
              />
              <FeatureCard 
                icon={<Heart className="text-red-500" />}
                title="9 Indian Languages"
                description="Communicate with your AI coach in your native tongue. Support for Malayalam, Hindi, Tamil, and more."
              />
              <FeatureCard 
                icon={<Utensils className="text-primary" />}
                title="10k+ Dish Database"
                description="Access the most comprehensive database of Indian regional dishes with verified nutritional information."
              />
              <FeatureCard 
                icon={<Zap className="text-accent" />}
                title="Real-time Tracking"
                description="Beautiful visual summaries of your macro-nutrient intake, activity levels, and weight progress."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Leaf className="text-white" size={14} />
            </div>
            <span className="font-headline font-bold text-primary">NutriKeralam</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 NutriKeralam. Empowering health through Indian wisdom.</p>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white border border-border/50 shadow-sm hover:shadow-md transition-shadow space-y-4">
      <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-headline font-semibold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
