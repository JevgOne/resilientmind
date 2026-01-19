import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, Video, MapPin, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const sessionTypes = [
  {
    title: "Discovery Call",
    duration: "30 min",
    price: "Free",
    description: "A free introductory call to discuss your needs and see if we're a good fit.",
    features: ["Understand your challenges", "Explore working together", "No commitment"],
  },
  {
    title: "1:1 Session",
    duration: "60 min",
    price: "€87",
    description: "Deep personal work tailored to your unique situation and goals.",
    features: ["Personalized approach", "Action plan", "Follow-up resources", "Email support"],
  },
  {
    title: "Family Session",
    duration: "90 min",
    price: "€120",
    description: "Work together as a family to build collective resilience.",
    features: ["Parent & child focused", "Creative activities", "Family action plan", "Take-home exercises"],
  },
];

const Booking = () => {
  const { user, profile } = useAuth();

  useEffect(() => {
    // Load Cal.com embed script
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-warm">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Calendar size={16} className="text-primary" />
                <span className="text-sm font-sans font-medium text-primary">
                  Book a Session
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-serif font-semibold mb-6">
                Let's Work <span className="text-gradient-gold">Together</span>
              </h1>
              
              <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
                Whether you prefer online sessions or in-person meetings in Spain, 
                I am here to support your journey to resilience.
              </p>
            </div>
          </div>
        </section>

        {/* Session Types */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-12 text-center">
                Choose Your Session Type
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {sessionTypes.map((session, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-2xl p-8 hover:shadow-elevated transition-all"
                  >
                    <div className="flex items-center gap-2 text-sm font-sans text-muted-foreground mb-4">
                      <Clock size={14} />
                      <span>{session.duration}</span>
                    </div>
                    
                    <h3 className="text-xl font-serif font-semibold mb-2">
                      {session.title}
                    </h3>
                    
                    <div className="text-2xl font-serif font-bold text-primary mb-4">
                      {session.price}
                    </div>
                    
                    <p className="text-muted-foreground font-sans text-sm mb-6">
                      {session.description}
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {session.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-sans">
                          <Check size={16} className="text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full py-3 bg-gradient-gold text-primary-foreground font-sans font-semibold rounded-xl shadow-gold hover:shadow-elevated transition-all">
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-12 text-center">
                How Sessions Work
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4 p-6 bg-background rounded-2xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Video size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg mb-2">Online Sessions</h3>
                    <p className="text-muted-foreground font-sans text-sm">
                      Connect from anywhere in the world via secure video call. 
                      Perfect for busy schedules and families across time zones.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 bg-background rounded-2xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg mb-2">In-Person Sessions</h3>
                    <p className="text-muted-foreground font-sans text-sm">
                      Available in select locations in Spain. In-person sessions 
                      allow for deeper hands-on creative work.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Calendar */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-4">
                  Book Your Session
                </h2>
                <p className="text-muted-foreground font-sans">
                  {profile?.membership_type === 'premium'
                    ? "Select a time for your complimentary Premium consultation"
                    : "Choose your preferred session type and select an available time slot"
                  }
                </p>
              </div>

              {/* Cal.com Embed */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                {/* Replace 'your-username/30min' with your actual Cal.com booking link */}
                <div
                  data-cal-link="your-username/30min"
                  data-cal-config='{"theme":"light"}'
                  className="min-h-[600px]"
                >
                  {/* Fallback while loading */}
                  <div className="flex flex-col items-center justify-center py-16">
                    <Calendar size={48} className="text-gold mb-4 animate-pulse" />
                    <p className="text-muted-foreground">Loading calendar...</p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Or email directly:
                      <a href="mailto:hello@resilientmind.com" className="text-gold hover:underline ml-1">
                        hello@resilientmind.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Alternative: Manual Calendly Embed (comment out Cal.com above and uncomment this) */}
              {/*
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <iframe
                  src="https://calendly.com/your-username/30min"
                  width="100%"
                  height="700"
                  frameBorder="0"
                  title="Book a session"
                />
              </div>
              */}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Booking;
