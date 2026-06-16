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
    <div className={`mx-auto bg-white text-slate-800 font-sans ${isExport ? 'w-full px-10 py-8' : 'max-w-[21cm] p-8 shadow-sm border border-gray-200'}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @page { margin: 0; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}} />
      
      {/* Header */}
      <div className="mb-3 border-b-2 border-indigo-100 pb-3">
        <h1 className="text-3xl font-heading font-semibold text-slate-900 tracking-tight mb-1">{resume.personalInfo?.name || resume.contact?.fullName}</h1>
        <div className="text-[13px] flex flex-wrap text-slate-500 font-medium tracking-wide gap-y-1">
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
        <div className="mb-3">
          <h2 className="text-[13px] font-heading font-semibold text-indigo-600 uppercase tracking-widest mb-2">{H.PROFILE}</h2>
          <p className="text-[13px] leading-relaxed text-slate-700">{resume.professionalSummary || resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {(resume.experiences || resume.experience) && (resume.experiences || resume.experience).length > 0 && (
        <div className="mb-3">
          <h2 className="text-[13px] font-heading font-semibold text-indigo-600 uppercase tracking-widest mb-2">{H.EXPERIENCE}</h2>
          <div className="space-y-2.5">
            {(resume.experiences || resume.experience).map((exp: any, i: number) => (
              <div key={i} className="break-inside-avoid mb-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-[14px] text-slate-900">{exp.title}</h3>
                  <span className="text-[12px] font-medium text-slate-500">{exp.startDate} – {exp.endDate || 'Present'}</span>
                </div>
                <div className="text-[13px] font-medium text-slate-600 mb-1.5">{exp.company} {exp.location ? `• ${exp.location}` : ""}</div>
                <ul className="list-disc pl-5 text-[13px] text-slate-700 space-y-0.5 marker:text-slate-400">
                  {(exp.description || exp.bullets || []).map((desc: string, j: number) => (
                    <li key={j} className="pl-1">{desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[13px] font-heading font-semibold text-indigo-600 uppercase tracking-widest mb-2">{H.SKILLS}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 gap-x-4">
            {resume.skills.map((skillGroup: any, i: number) => (
              <div key={i} className="text-[13px] break-inside-avoid">
                <span className="font-bold text-slate-800">{skillGroup.category || skillGroup.group}:</span> <span className="text-slate-600">{skillGroup.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[13px] font-heading font-semibold text-indigo-600 uppercase tracking-widest mb-2">{H.EDUCATION}</h2>
          <div className="space-y-1.5">
            {resume.education.map((edu: any, i: number) => (
              <div key={i} className="flex justify-between items-baseline break-inside-avoid">
                <div>
                  <div className="font-bold text-[14px] text-slate-900">{edu.institution}</div>
                  <div className="text-[13px] text-slate-600">{edu.degree}</div>
                </div>
                <div className="text-[12px] font-medium text-slate-500">{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[13px] font-heading font-semibold text-indigo-600 uppercase tracking-widest mb-2">{H.CERTIFICATIONS}</h2>
          <div className="space-y-1">
            {resume.certifications.map((cert: any, i: number) => (
              <div key={i} className="flex justify-between items-baseline text-[13px] break-inside-avoid">
                <div className="text-slate-800"><span className="font-bold text-slate-900">{cert.name}</span> • {cert.issuer}</div>
                <div className="text-[12px] font-medium text-slate-500">{cert.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
