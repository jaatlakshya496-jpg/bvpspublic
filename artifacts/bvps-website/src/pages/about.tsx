import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Target, BookOpen, Clock, Heart, Award, Quote, X, ArrowRight, Flag, Building2, Trophy, Users } from 'lucide-react';
import aboutImg from '@assets/bal-vikas-public-school-kalayat-kaithal-schools-3t6w6qk_1784611430223.jpg';
import principalImg from '@assets/principal-ramphal-sharma.png';
import schoolBuildingImg from '@assets/bal-vikas-public-school-kalayat-kaithal-schools-3t6w6qk_1784611430223.jpg';
import studentsImg from '@assets/Screenshot_20260721_101418_1784611875385.jpg';
import campusImg from '@assets/Screenshot_20260721_101549_1784612008898.jpg';
import schoolEventImg from '@assets/Screenshot_20260721_101332_1784611875316.jpg';

const overviewCards = [
  {
    icon: Award,
    title: 'School Type',
    desc: 'Private, Co-educational\n(Boys & Girls)',
    image: schoolBuildingImg,
    detail: 'Bal Vikas Public School is a private co-educational institution welcoming both boys and girls from Class 1 to 12, fostering a balanced and inclusive learning environment.',
  },
  {
    icon: BookOpen,
    title: 'Academic Level',
    desc: 'Senior Secondary\n(Classes 1 to 12)',
    image: studentsImg,
    detail: 'We offer a complete academic journey from primary through senior secondary (Class 12), preparing students for board exams and higher education.',
  },
  {
    icon: Heart,
    title: 'Medium',
    desc: 'Hindi Medium Instruction\nwith English integration',
    image: schoolEventImg,
    detail: 'Instruction is delivered in Hindi to keep students rooted in their language, while English is integrated across subjects to build confidence in both languages.',
  },
  {
    icon: Clock,
    title: 'School Hours',
    desc: 'Mon–Sat: 8:00 AM – 3:00 PM\nSunday: Closed',
    image: campusImg,
    detail: 'School runs six days a week, Monday to Saturday, from 8:00 AM to 3:00 PM. Morning assembly begins the day, building discipline and community spirit.',
  },
];

type OverviewCard = typeof overviewCards[number];

const journeyMilestones = [
  {
    year: '2004',
    title: 'A Vision Takes Root',
    description: 'Bal Vikas Public School began with a simple promise — to bring meaningful, quality education closer to the families of Kalayat.',
    image: schoolBuildingImg,
    icon: Flag,
    color: 'from-orange-500 to-amber-400',
  },
  {
    year: 'Growing Years',
    title: 'Building Strong Foundations',
    description: 'With dedicated teachers and a values-first approach, BVPS grew into a trusted school community where every child could feel seen and supported.',
    image: campusImg,
    icon: Building2,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    year: 'Classes 1–12',
    title: 'A Complete Learning Journey',
    description: 'The school expanded its academic journey from primary years through senior secondary, helping students grow with confidence at every stage.',
    image: studentsImg,
    icon: Trophy,
    color: 'from-fuchsia-500 to-purple-500',
  },
  {
    year: 'Today',
    title: 'A Community in Motion',
    description: 'Today, 945+ students, 29+ teachers and 31 classrooms carry the BVPS story forward through learning, sports, creativity and achievement.',
    image: schoolEventImg,
    icon: Users,
    color: 'from-emerald-500 to-teal-400',
  },
];

function CountUp({ 
  value, 
  suffix = '', 
  className = '' 
}: { 
  value: number; 
  suffix?: string; 
  className?: string; 
}) {
  const [count, setCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = numberRef.current;
    if (!element) return;

    let frame = 0;
    let observer: IntersectionObserver | undefined;

    const animate = () => {
      const start = performance.now();
      const duration = 1600;
      const update = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(Math.round(value * eased));
        if (progress < 1) {
          frame = requestAnimationFrame(update);
        } else {
          setIsFinished(true);
        }
      };
      frame = requestAnimationFrame(update);
    };

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer?.disconnect();
        }
      }, { threshold: 0.25 });
      observer.observe(element);
    } else {
      animate();
    }

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [value]);

  return (
    <motion.span 
      ref={numberRef}
      animate={isFinished ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`inline-block tabular-nums font-serif font-black tracking-tight ${className}`}
    >
      {count.toLocaleString('en-IN')}{suffix}
    </motion.span>
  );
}

export default function About() {
  const [selected, setSelected] = useState<OverviewCard | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="bg-primary pt-24 pb-16 px-4 relative overflow-hidden">
        <img src={aboutImg} alt="" className="absolute inset-0 w-full h-full object-cover object-center opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-primary/55" />
        <div className="container mx-auto text-center relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">About BVPS</h1>
            <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full"></div>
            <p className="mt-6 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Nurturing minds and shaping futures in Kalayat since 2004.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <ScrollReveal direction="right">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-black">Our History & Heritage</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Bal Vikas Public School (BVPS) was established in the year 2004 with a clear vision: to bring quality, modern education to the heart of rural Haryana. 
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  What started as a modest endeavor has blossomed into Kalayat's most trusted neighborhood school, now proudly serving over 945 students from Classes 1 to 12. We are a private, co-educational senior secondary institution offering instruction in Hindi medium, ensuring our students remain connected to their linguistic roots while mastering modern curriculum.
                </p>
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 border-t border-border mt-8">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-white border border-amber-200/80 shadow-2xs hover:shadow-md transition-all">
                    <p className="text-2xl sm:text-3xl font-serif font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      <CountUp value={2004} />
                    </p>
                    <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mt-1">Established</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gradient-to-b from-cyan-500/10 to-white border border-cyan-200/80 shadow-2xs hover:shadow-md transition-all">
                    <p className="text-2xl sm:text-3xl font-serif font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                      <CountUp value={945} suffix="+" />
                    </p>
                    <p className="text-[11px] font-bold text-cyan-900 uppercase tracking-wider mt-1">Students</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-white border border-emerald-200/80 shadow-2xs hover:shadow-md transition-all">
                    <p className="text-2xl sm:text-3xl font-serif font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      <CountUp value={29} suffix="+" />
                    </p>
                    <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider mt-1">Teachers</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gradient-to-b from-purple-500/10 to-white border border-purple-200/80 shadow-2xs hover:shadow-md transition-all">
                    <p className="text-2xl sm:text-3xl font-serif font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      <CountUp value={12} suffix="th" />
                    </p>
                    <p className="text-[11px] font-bold text-purple-900 uppercase tracking-wider mt-1">Classes 1–12</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="left">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img 
                  src={aboutImg} 
                  alt="Students in classroom" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/5"></div>
              </div>
            </ScrollReveal>
          </div>

          {/* Our Journey */}
          <ScrollReveal>
            <section className="mb-24 overflow-hidden rounded-[2rem] bg-[#07101f] p-6 text-white shadow-2xl md:p-10 lg:p-12">
              <div className="relative">
                <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="relative z-10 mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                  <div className="max-w-2xl">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="h-px w-10 bg-secondary" />
                      <span className="text-xs font-bold uppercase tracking-[0.24em] text-secondary">Since 2004</span>
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-white md:text-5xl">Our Journey</h2>
                    <p className="mt-4 leading-relaxed text-white/65">
                      From a hopeful beginning to a thriving learning community — every chapter of BVPS has been shaped by children, families and teachers moving forward together.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur-sm">
                    <div className="flex -space-x-2">
                      {[schoolBuildingImg, studentsImg, schoolEventImg].map((image, i) => (
                        <img
                          key={image}
                          src={image}
                          alt=""
                          className="h-10 w-10 rounded-full border-2 border-[#07101f] object-cover"
                          style={{ zIndex: 3 - i }}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">One school, many stories</p>
                      <p className="text-xs text-white/50">Growing together in Kalayat</p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 grid gap-7 lg:grid-cols-4 lg:gap-5">
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="pointer-events-none absolute bottom-7 left-5 top-5 w-px origin-top bg-gradient-to-b from-orange-400 via-fuchsia-400 to-teal-300 lg:bottom-auto lg:left-[12%] lg:right-[12%] lg:top-5 lg:h-px lg:w-auto lg:origin-left lg:bg-gradient-to-r"
                  />
                  {journeyMilestones.map((milestone, index) => (
                    <motion.article
                      key={milestone.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: index * 0.1, duration: 0.45 }}
                      whileHover={{ y: -8 }}
                      className="group relative ml-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] shadow-lg backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.12] lg:ml-0 lg:pt-14"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.12, 1], boxShadow: ['0 0 0 0 rgba(249,115,22,0)', '0 0 0 8px rgba(249,115,22,0.12)', '0 0 0 0 rgba(249,115,22,0)'] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.2 }}
                        className={`absolute -left-10 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#07101f] bg-gradient-to-br ${milestone.color} text-white lg:left-1/2 lg:top-0 lg:-translate-x-1/2`}
                      >
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </motion.div>
                      <div className="relative h-36 overflow-hidden">
                        <img
                          src={milestone.image}
                          alt={milestone.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07101f] via-[#07101f]/20 to-transparent" />
                        <div className={`absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${milestone.color} text-white shadow-lg`}>
                          <milestone.icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="relative p-5">
                        <div className={`mb-2 inline-flex rounded-full bg-gradient-to-r ${milestone.color} px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white`}>
                          {milestone.year}
                        </div>
                        <h3 className="font-serif text-xl font-bold text-white">{milestone.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/60">{milestone.description}</p>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 mb-24">
            <ScrollReveal delay={0.1}>
              <div className="bg-white p-10 rounded-2xl border-t-4 border-secondary shadow-sm h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <Target className="w-12 h-12 text-secondary mb-6 relative z-10" />
                <h3 className="text-2xl font-serif font-bold text-black mb-4 relative z-10">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  To provide a nurturing, safe, and stimulating environment where every child can achieve their full academic, physical, and social potential. We strive to empower students with knowledge, moral values, and the confidence to succeed in an ever-changing world.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-primary text-primary-foreground p-10 rounded-2xl shadow-xl h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <BookOpen className="w-12 h-12 text-secondary mb-6 relative z-10" />
                <h3 className="text-2xl font-serif font-bold mb-4 relative z-10">Our Vision</h3>
                <p className="text-primary-foreground/80 leading-relaxed relative z-10">
                  To be recognized as a center of academic excellence that fosters critical thinking, creativity, and character development, preparing the youth of Kalayat to be responsible and contributing citizens of tomorrow.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Principal Section */}
          <ScrollReveal>
            <div className="mb-24 bg-gradient-to-br from-primary to-primary/90 rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -translate-y-1/3 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="shrink-0 flex flex-col items-center gap-3">
                  <div className="w-28 h-28 rounded-full border-4 border-secondary overflow-hidden">
                    <img src={principalImg} alt="Sh. Ramphal Sharma" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-serif font-bold text-xl">Sh. Ramphal Sharma</p>
                    <p className="text-secondary text-sm font-medium uppercase tracking-wider mt-1">Principal</p>
                    <p className="text-primary-foreground/60 text-xs mt-1">Bal Vikas Public School, Kalayat</p>
                  </div>
                </div>
                <div className="flex-1">
                  <Quote className="w-10 h-10 text-secondary/40 mb-3" />
                  <p className="text-primary-foreground/85 text-lg leading-relaxed italic">
                    "At Bal Vikas Public School, we believe every child carries within them the seeds of greatness. Our mission is to nurture those seeds — with discipline, compassion, and knowledge — so they may grow into confident, responsible citizens who make their families and nation proud."
                  </p>
                  <p className="mt-6 text-primary-foreground/60 text-sm">
                    Under his guidance since the school's founding, BVPS has grown from a small institution into a thriving center of learning with nearly 945 students, 29 dedicated teachers, and a legacy of academic and sports excellence.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* School Details */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-border shadow-md">
              <h2 className="text-3xl font-serif font-bold text-black mb-2 text-center">School Overview</h2>
              <p className="text-center text-muted-foreground text-sm mb-10">Click any card to see a photo</p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewCards.map((card, i) => (
                  <motion.button
                    key={card.title}
                    onClick={() => setSelected(card)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5, scale: 1.03 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.35 }}
                    className="flex flex-col items-center text-center p-6 bg-primary rounded-2xl cursor-pointer group hover:bg-primary/90 hover:shadow-xl transition-all w-full relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors duration-300 rounded-2xl" />
                    <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform relative z-10">
                      <card.icon className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-white relative z-10">{card.title}</h4>
                    <p className="text-primary-foreground/70 text-sm relative z-10 whitespace-pre-line">{card.desc}</p>
                    <span className="mt-3 text-secondary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity relative z-10">Tap to see photo →</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Modal */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={() => setSelected(null)}
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.85, opacity: 0, y: 30 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <img
                      src={selected.image}
                      alt={selected.title}
                      className="w-full h-72 object-cover"
                    />
                    <button
                      onClick={() => setSelected(null)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-5 flex items-center gap-2">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary shrink-0">
                        <selected.icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-white font-serif font-bold text-xl">{selected.title}</h3>
                    </div>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-muted-foreground leading-relaxed text-sm">{selected.detail}</p>
                    <button
                      onClick={() => setSelected(null)}
                      className="mt-4 inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:text-secondary transition-colors"
                    >
                      Close <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </div>
  );
}
