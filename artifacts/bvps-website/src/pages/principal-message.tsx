import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Link } from 'wouter';
import { Quote, Phone, ArrowLeft, ArrowRight, GraduationCap } from 'lucide-react';
import principalImg from '@assets/principal-ramphal-sharma.png';

export default function PrincipalMessage() {
  return (
    <div className="flex flex-col">
      <div className="bg-primary pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <ScrollReveal>
            <span className="text-secondary font-semibold uppercase tracking-widest text-sm">From the Desk of</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 mt-2">Principal's Message</h1>
            <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full" />
            <p className="mt-6 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              A personal welcome from the founder and principal of BVPS Kalayat.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <Link href="/" className="inline-flex items-center gap-2 mt-6 text-primary-foreground/70 hover:text-secondary transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </ScrollReveal>
        </div>
      </div>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-10">

          {/* Main card */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl shadow-lg border border-border overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Photo */}
                <div className="md:w-72 shrink-0 bg-primary flex flex-col items-center justify-center p-10 gap-4">
                  <div className="w-36 h-36 rounded-full border-4 border-secondary overflow-hidden shadow-xl">
                    <img src={principalImg} alt="Sh. Ramphal Sharma" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-serif font-bold text-xl leading-tight">Sh. Ramphal Sharma</p>
                    <p className="text-secondary text-sm font-semibold uppercase tracking-wider mt-1">Principal &amp; Founder</p>
                    <p className="text-primary-foreground/60 text-xs mt-1">Bal Vikas Public School</p>
                    <p className="text-primary-foreground/60 text-xs">Kalayat, Haryana</p>
                    <div className="mt-3 px-3 py-1 bg-secondary/20 rounded-full">
                      <p className="text-secondary text-xs font-bold">Est. 2004</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="flex-1 p-8 md:p-12">
                  <Quote className="w-12 h-12 text-secondary/20 mb-4" />
                  <p className="text-muted-foreground text-base leading-relaxed italic mb-5 text-lg">
                    "Welcome to Bal Vikas Public School — a place where every child's potential is recognized and nurtured. As you consider joining our school family, I want you to know that our doors are open to all students who are eager to learn, grow, and contribute to society."
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    At BVPS, we believe education is not just about academics — it is about building character, confidence, and compassion. Our dedicated team of 29 teachers works tirelessly to ensure that every student receives personal attention and the best possible guidance.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Since our founding in 2004, we have grown from a small school into Kalayat's most trusted institution with nearly 945 students. Every child who walks through our doors becomes part of a legacy built on discipline, values, and academic excellence.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    I warmly invite you and your family to visit our school, meet our staff, and experience the BVPS spirit firsthand. We look forward to welcoming your child into our family for the session 2025–26.
                  </p>
                  <div className="pt-6 border-t border-border">
                    <p className="font-serif font-bold text-black text-lg">Sh. Ramphal Sharma</p>
                    <p className="text-secondary text-sm font-medium">Principal &amp; Founder, BVPS Kalayat</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '2004', label: 'Year Founded' },
              { value: '945+', label: 'Students' },
              { value: '29', label: 'Teachers' },
              { value: '1–12', label: 'Classes' },
            ].map(({ value, label }) => (
              <ScrollReveal key={label}>
                <div className="bg-white rounded-2xl border border-border shadow-sm p-5 text-center">
                  <p className="text-3xl font-serif font-bold text-secondary mb-1">{value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* CTA */}
          <ScrollReveal>
            <div className="bg-primary text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-serif font-bold mb-1">Speak with the Principal</h3>
                <p className="text-primary-foreground/80 text-sm">Reach out directly — we're happy to answer any questions.</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <a href="tel:+919812550200" className="inline-flex items-center gap-2 bg-secondary text-primary hover:bg-secondary/90 font-bold rounded-full px-6 h-11 text-sm transition-colors whitespace-nowrap">
                  <Phone className="w-4 h-4" /> Call Now
                </a>
                <Link href="/application" className="inline-flex items-center gap-2 border border-white text-white hover:bg-white hover:text-primary font-bold rounded-full px-6 h-11 text-sm bg-white/10 transition-colors whitespace-nowrap">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>
    </div>
  );
}
