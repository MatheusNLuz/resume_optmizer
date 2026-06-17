export function ModernAtsTemplate({ resume, isExport, language = "en-US" }: { resume: any, isExport: boolean, language?: string }) {
  const isPT = language === "pt-BR";
  const H = {
    PROFILE: isPT ? "PERFIL" : "PROFILE",
    EXPERIENCE: isPT ? "EXPERIÊNCIA" : "EXPERIENCE",
    SKILLS: isPT ? "HABILIDADES" : "SKILLS",
    EDUCATION: isPT ? "EDUCAÇÃO" : "EDUCATION",
    CERTIFICATIONS: isPT ? "CERTIFICAÇÕES" : "CERTIFICATIONS"
  };

  const getContactItems = () => {
    const items = [];
    const loc = resume.personalInfo?.location || resume.contact?.location;
    if (loc) items.push({ label: loc });
    const phone = resume.personalInfo?.phone || resume.contact?.phone;
    if (phone) items.push({ label: phone });
    const email = resume.personalInfo?.email || resume.contact?.email;
    if (email) items.push({ label: email, url: `mailto:${email}` });
    const linkedin = resume.personalInfo?.linkedin || resume.contact?.linkedin;
    if (linkedin) items.push({ label: 'LinkedIn', url: linkedin.startsWith('http') ? linkedin : `https://${linkedin}` });
    const portfolio = resume.personalInfo?.portfolio || resume.contact?.portfolio;
    if (portfolio) items.push({ label: portfolio.toLowerCase().includes('github') ? 'GitHub' : 'Portfolio', url: portfolio.startsWith('http') ? portfolio : `https://${portfolio}` });
    return items;
  };

  const contactItems = getContactItems();

  return (
    <div className={`mx-auto bg-white text-[#334155] font-sans ${isExport ? 'w-full px-10 py-10' : 'max-w-[21cm] p-10 shadow-lg border border-gray-100'}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @page { margin: 0; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}} />
      
      {/* Header Full Width */}
      <header className="mb-6 border-b-2 border-indigo-100 pb-5">
        <h1 className="text-[32px] font-bold text-[#0f172a] tracking-tight mb-2 leading-none">
          {resume.personalInfo?.name || resume.contact?.fullName}
        </h1>
        <div className="text-[13px] text-[#64748b] flex flex-wrap items-center gap-y-1">
          {contactItems.map((item, index) => (
            <span key={index} className="flex items-center">
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-indigo-600 transition-colors">{item.label}</a>
              ) : (
                item.label
              )}
              {index < contactItems.length - 1 && <span className="mx-2 text-slate-300">|</span>}
            </span>
          ))}
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* LEFT COLUMN: Summary & Experience (Wider) */}
        <div className="w-full md:w-[65%] space-y-6">
          {/* Summary */}
          {(resume.professionalSummary || resume.summary) && (
            <section>
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#4F46E5] mb-2 flex items-center">
                {H.PROFILE}
              </h3>
              <p className="text-[13px] leading-relaxed text-justify text-[#334155]">
                {resume.professionalSummary || resume.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {(resume.experiences || resume.experience) && (resume.experiences || resume.experience).length > 0 && (
            <section>
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#4F46E5] mb-4 flex items-center">
                {H.EXPERIENCE}
              </h3>
              <div className="space-y-5">
                {(resume.experiences || resume.experience).map((exp: any, i: number) => (
                  <div key={i} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-bold text-[14px] text-[#0f172a]">{exp.title}</h4>
                      <span className="text-[12px] font-medium text-[#64748b] whitespace-nowrap ml-2">
                        {exp.startDate} – {exp.endDate || (isPT ? 'Atualmente' : 'Present')}
                      </span>
                    </div>
                    <div className="text-[13px] text-[#475569] font-medium mb-1.5">
                      {exp.company}{exp.location ? ` • ${exp.location}` : ""}
                    </div>
                    <ul className="list-disc pl-4 text-[13px] space-y-1 text-[#334155] marker:text-[#94a3b8]">
                      {(exp.description || exp.bullets || []).map((desc: string, j: number) => (
                        <li key={j} className="pl-1 leading-relaxed">{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: Skills, Education & Certifications (Narrower) */}
        <div className="w-full md:w-[35%] space-y-6">
          
          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <section className="break-inside-avoid">
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#4F46E5] mb-3">
                {H.SKILLS}
              </h3>
              <div className="flex flex-col gap-3 text-[13px] text-[#334155]">
                {resume.skills.map((skillGroup: any, i: number) => (
                  <div key={i}>
                    <div className="font-bold text-[#0f172a] mb-0.5">{skillGroup.category || skillGroup.group}</div>
                    <div className="text-[#475569] leading-snug">{skillGroup.items.join(", ")}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <section className="break-inside-avoid">
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#4F46E5] mb-3">
                {H.EDUCATION}
              </h3>
              <div className="space-y-4">
                {resume.education.map((edu: any, i: number) => (
                  <div key={i}>
                    <h4 className="font-bold text-[13px] text-[#0f172a] leading-tight">{edu.institution}</h4>
                    <div className="text-[13px] text-[#475569] mt-0.5 mb-1 leading-snug">{edu.degree}</div>
                    <div className="text-[12px] text-[#64748b]">{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {resume.certifications && resume.certifications.length > 0 && (
            <section className="break-inside-avoid">
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#4F46E5] mb-3">
                {H.CERTIFICATIONS}
              </h3>
              <div className="space-y-3">
                {resume.certifications.map((cert: any, i: number) => (
                  <div key={i} className="text-[13px]">
                    <div className="font-bold text-[#0f172a] leading-tight">{cert.name}</div>
                    {cert.issuer && <div className="text-[#475569] mt-0.5">{cert.issuer}</div>}
                    <div className="text-[12px] text-[#64748b] mt-0.5">{cert.date}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
