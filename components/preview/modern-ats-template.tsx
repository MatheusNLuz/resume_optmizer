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
    <div className={`mx-auto bg-white text-[#334155] font-sans ${isExport ? 'w-full px-10 py-8' : 'max-w-[21cm] p-8 shadow-lg border border-gray-100'}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @page { margin: 0; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}} />
      
      {/* Header */}
      <div className="mb-3 border-b-2 border-indigo-100 pb-3">
        <h1 className="text-3xl font-heading font-semibold text-slate-900 tracking-tight mb-1">{resume.personalInfo?.name || resume.contact?.fullName}</h1>
        <div className="text-[13.5px] text-[#64748b] flex flex-wrap items-center">
          {contactItems.map((item, index) => (
            <span key={index} className="whitespace-nowrap">
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer" className="text-slate-700 hover:text-indigo-600 transition-colors">{item.label}</a>
              ) : (
                item.label
              )}
              {index < contactItems.length - 1 && <span className="mx-2 text-slate-300">|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {(resume.professionalSummary || resume.summary) && (
        <section className="mb-4">
          <h3 className="text-[12.5px] font-bold uppercase tracking-widest text-[#4F46E5] mb-2">{H.PROFILE}</h3>
          <p className="text-[13.5px] leading-relaxed text-justify text-[#334155]">
            {resume.professionalSummary || resume.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {(resume.experiences || resume.experience) && (resume.experiences || resume.experience).length > 0 && (
        <section className="mb-4">
          <h3 className="text-[12.5px] font-bold uppercase tracking-widest text-[#4F46E5] mb-2">
            {H.EXPERIENCE}
          </h3>
          <div className="space-y-3.5">
            {(resume.experiences || resume.experience).map((exp: any, i: number) => (
              <div key={i} className="break-inside-avoid mb-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-[14.5px] text-[#0f172a]">{exp.title}</h4>
                  <span className="text-[13px] text-[#64748b]">
                    {exp.startDate} – {exp.endDate || (isPT ? 'Atualmente' : 'Present')}
                  </span>
                </div>
                <div className="text-[13.5px] text-[#475569] mb-1.5">
                  {exp.company}{exp.location ? ` • ${exp.location}` : ""}
                </div>
                <ul className="list-disc pl-5 text-[13.5px] space-y-1 text-[#334155] marker:text-[#94a3b8]">
                  {(exp.description || exp.bullets || []).map((desc: string, j: number) => (
                    <li key={j} className="pl-1">{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <section className="mb-4 break-inside-avoid">
          <h3 className="text-[12.5px] font-bold uppercase tracking-widest text-[#4F46E5] mb-2">
            {H.SKILLS}
          </h3>
          <div className="text-[13.5px] grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[#334155]">
            {resume.skills.map((skillGroup: any, i: number) => (
              <div key={i} className="text-[13px] break-inside-avoid">
                <span className="font-bold text-slate-800">{skillGroup.category || skillGroup.group}:</span> <span className="text-slate-600">{skillGroup.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <section className="mb-4 break-inside-avoid">
          <h3 className="text-[12.5px] font-bold uppercase tracking-widest text-[#4F46E5] mb-2">
            {H.EDUCATION}
          </h3>
          <div className="space-y-2.5">
            {resume.education.map((edu: any, i: number) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <h4 className="font-bold text-[14px] text-[#0f172a]">{edu.institution}</h4>
                  <div className="text-[13.5px] text-[#475569] mt-0.5">{edu.degree}</div>
                </div>
                <span className="text-[13px] text-[#64748b] whitespace-nowrap ml-4">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <section className="break-inside-avoid">
          <h3 className="text-[12.5px] font-bold uppercase tracking-widest text-[#4F46E5] mb-2">
            {H.CERTIFICATIONS}
          </h3>
          <div className="space-y-2">
            {resume.certifications.map((cert: any, i: number) => (
              <div key={i} className="flex justify-between items-baseline text-[13.5px]">
                <div className="text-[#0f172a]">
                  <span className="font-bold">{cert.name}</span>
                  {cert.issuer && <span className="text-[#475569] font-normal"> • {cert.issuer}</span>}
                </div>
                <span className="text-[#64748b] whitespace-nowrap ml-4">{cert.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
