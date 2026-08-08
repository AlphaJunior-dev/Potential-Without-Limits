"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Send, 
  BookOpen, 
  Code, 
  Award, 
  Globe, 
  ShieldCheck,
  UserCheck
} from "lucide-react";

export default function VolunteerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [track, setTrack] = useState("Academic & STEM Tutor");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setPhone("");
      setCountry("");
      setMessage("");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-inter text-[#051836] bg-foundation-pattern py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block mb-2">
            <img
              src="/pwlif-logo.png"
              alt="Potential Without Limits International Foundation"
              className="h-16 w-auto mx-auto object-contain"
            />
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#005C27]/10 border border-[#005C27]/20 text-[#005C27] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#F5AB00]" />
            <span>Community &amp; Global Mentorship Hub</span>
          </div>

          <h1 className="font-montserrat text-4xl sm:text-6xl font-black tracking-tight text-[#051836]">
            Become a Volunteer or Mentor
          </h1>
          <p className="font-inter text-base sm:text-lg text-[#051836]/70 max-w-3xl mx-auto leading-relaxed">
            Share your expertise, inspire young dreamers, and support talent development across Ethiopia and regional learning hubs.
          </p>
        </div>

        {/* 4 Volunteer Tracks */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
              Impact Opportunities
            </span>
            <h2 className="font-montserrat text-2xl sm:text-3xl font-black text-[#051836]">
              Volunteer &amp; Mentorship Tracks
            </h2>
            <p className="text-xs sm:text-sm text-[#051836]/70 mt-2">
              Whether online or on-site at our Talent Development Centres, your skills transform lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter">
            {[
              {
                title: "Academic & STEM Tutor",
                desc: "Teach mathematics, science, physics, and academic literacy to elementary and secondary youth preparing for national examinations and scholarships.",
                icon: BookOpen,
                badge: "Remote or On-site",
              },
              {
                title: "Technical Mentor (Coding & Digital Arts)",
                desc: "Guide aspiring developers, 3D artists, and robotics builders in Python, web development, Blender, electronic hardware, and digital audio scoring.",
                icon: Code,
                badge: "Technical Expert",
              },
              {
                title: "Community Youth Coordinator",
                desc: "Organize local workshops, community showcases, equipment distributions, and guardian engagement activities at regional learning hubs.",
                icon: Users,
                badge: "Community Field Lead",
              },
              {
                title: "Child Advocacy & Psychosocial Specialist",
                desc: "Support child safety monitoring, health education, career counseling, and holistic wellbeing for sponsored children and families.",
                icon: ShieldCheck,
                badge: "Safeguarding Specialist",
              },
            ].map((t, idx) => {
              const IconComp = t.icon;
              return (
                <div key={idx} className="bg-white p-7 rounded-3xl border border-[#051836]/10 shadow-lg space-y-4 hover:border-[#005C27]/40 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="bg-[#005C27]/10 text-[#005C27] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#005C27]/20">
                        {t.badge}
                      </span>
                    </div>

                    <h3 className="font-montserrat font-bold text-lg text-[#051836]">
                      {t.title}
                    </h3>
                    <p className="text-xs text-[#051836]/70 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Volunteer Application Form Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#051836]/10 shadow-2xl space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 border-b border-[#051836]/10 pb-4">
            <div className="p-3 rounded-2xl bg-[#005C27]/10 text-[#005C27] border border-[#005C27]/20">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#005C27]">
                Join Our Network
              </span>
              <h2 className="font-montserrat font-bold text-2xl text-[#051836]">
                Volunteer Application Form
              </h2>
            </div>
          </div>

          {isSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl space-y-3 text-center animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-[#005C27] mx-auto" />
              <h3 className="font-montserrat font-bold text-lg">Thank You for Applying!</h3>
              <p className="text-xs leading-relaxed max-w-md mx-auto">
                Your volunteer application has been received. Our PWLIF community engagement team will contact you within 2 business days to schedule an orientation call.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-2 text-xs font-bold text-[#005C27] hover:underline"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-inter text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#051836] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-[#051836] focus:outline-none focus:border-[#005C27]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#051836] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-[#051836] focus:outline-none focus:border-[#005C27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#051836] mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-[#051836] focus:outline-none focus:border-[#005C27]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#051836] mb-1">Country of Residence</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Ethiopia, USA, Kenya..."
                    className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-[#051836] focus:outline-none focus:border-[#005C27]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#051836] mb-1">Preferred Mentorship Track</label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-[#051836] focus:outline-none focus:border-[#005C27]"
                >
                  <option value="Academic & STEM Tutor">Academic &amp; STEM Tutor</option>
                  <option value="Technical Mentor (Coding & Digital Arts)">Technical Mentor (Coding &amp; Digital Arts)</option>
                  <option value="Community Youth Coordinator">Community Youth Coordinator</option>
                  <option value="Child Advocacy & Psychosocial Specialist">Child Advocacy &amp; Psychosocial Specialist</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#051836] mb-1">Background / Message Summary</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a brief overview of your skills, background, or interest in supporting PWLIF youth..."
                  className="w-full p-3 bg-[#F8FAFC] border border-[#051836]/15 rounded-xl text-[#051836] focus:outline-none focus:border-[#005C27]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#005C27] hover:bg-[#327B2F] text-white font-montserrat font-bold py-3.5 px-6 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#F5AB00]" />
                <span>Submit Volunteer Application</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
