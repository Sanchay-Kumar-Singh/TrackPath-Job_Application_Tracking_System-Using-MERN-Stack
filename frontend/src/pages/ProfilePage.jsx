import { useState, useEffect } from "react";
import {
  Save,
  Lock,
  User,
  Calendar,
  Phone,
  MapPin,
  GraduationCap,
  School,
  Award,
  Plus,
  Terminal,
  Layers3,
  Database,
  Wrench,
  Cpu,
  Code,
  Briefcase,
  ExternalLink,
  FolderGit2,
  Link2,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Button from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/FormFields";
import ProfilePhotoUpload from "../components/profile/ProfilePhotoUpload";
import ProjectCard from "../components/profile/ProjectCard";
import ProfileLinkBox from "../components/profile/ProfileLinkBox";
import ResumeViewer from "../components/profile/ResumeViewer";
import SectionCard from "../components/profile/SectionCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import * as authApi from "../api/authApi";

const emptyProject = {
  title: "",
  techStack: "",
  description: "",
  githubLink: "",
  liveLink: "",
};

const skillFieldConfig = [
  { key: "skillsLanguages", label: "Programming Languages", icon: Terminal, placeholder: "Java, JavaScript (ES6+), SQL" },
  { key: "skillsFrontend", label: "Frontend Development", icon: Layers3, placeholder: "HTML5, CSS3, React.js, Tailwind CSS" },
  { key: "skillsBackend", label: "Backend Development", icon: Code, placeholder: "Node.js, Express.js, RESTful APIs, JWT Auth" },
  { key: "skillsDatabases", label: "Databases", icon: Database, placeholder: "MongoDB, MySQL, PostgreSQL" },
  { key: "skillsTools", label: "Tools & Platforms", icon: Wrench, placeholder: "Git, GitHub, Postman, Vercel, VS Code" },
  { key: "skillsCore", label: "Core Concepts", icon: Cpu, placeholder: "DSA, OOP, DBMS, Computer Networks, OS" },
];

const ProfilePage = () => {
  const { user, setUser, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    location: "",
    bio: "",
    qualification: "",
    college: "",
    graduationYear: "",
    cgpa: "",
    skillsLanguages: "",
    skillsFrontend: "",
    skillsBackend: "",
    skillsDatabases: "",
    skillsTools: "",
    skillsCore: "",
    linkedin: "",
    github: "",
    leetcode: "",
    portfolio: "",
  });
  const [projects, setProjects] = useState([{ ...emptyProject }, { ...emptyProject }]);
  const [saving, setSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Always pull the freshest profile the moment this page mounts — closes any
  // race where AuthContext's cached/stale user briefly renders before the
  // real server data arrives (was causing "blank until refresh").
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        await refreshUser();
      } catch (err) {
        // AuthContext's own interceptor handles redirect-on-401; just stop the spinner here
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        age: user.age || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        qualification: user.qualification || "",
        college: user.college || "",
        graduationYear: user.graduationYear || "",
        cgpa: user.cgpa || "",
        skillsLanguages: user.skillsLanguages || "",
        skillsFrontend: user.skillsFrontend || "",
        skillsBackend: user.skillsBackend || "",
        skillsDatabases: user.skillsDatabases || "",
        skillsTools: user.skillsTools || "",
        skillsCore: user.skillsCore || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        leetcode: user.leetcode || "",
        portfolio: user.portfolio || "",
      });
      setProjects(
        user.projects && user.projects.length > 0
          ? user.projects
          : [{ ...emptyProject }, { ...emptyProject }]
      );
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProjectChange = (index, updatedProject) => {
    setProjects((prev) => prev.map((p, i) => (i === index ? updatedProject : p)));
  };

  const handleAddProject = () => {
    setProjects((prev) => [...prev, { ...emptyProject }]);
  };

  const handleRemoveProject = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const persistUser = (data) => {
    setUser(data);
    localStorage.setItem("jobtracker_user", JSON.stringify(data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authApi.updateProfile({ ...form, projects });
      persistUser(data);
      showToast("Profile updated successfully.", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file) => {
    try {
      const { data } = await authApi.uploadPhoto(file);
      persistUser(data);
      showToast("Photo updated.", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to upload photo.", "error");
    }
  };

  const handleResumeUpload = async (file) => {
    try {
      const { data } = await authApi.uploadResume(file);
      persistUser(data);
      showToast("Resume uploaded.", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to upload resume.", "error");
    }
  };

  const handleResumeDelete = async () => {
    try {
      const { data } = await authApi.deleteResume();
      persistUser(data);
      showToast("Resume removed.", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove resume.", "error");
    }
  };

  if (pageLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-8 py-5 sm:py-7 max-w-full">
          <div className="h-7 w-40 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-4 w-72 bg-slate-100 rounded-md animate-pulse mt-2" />

          <div className="mt-6 space-y-5">
            <div className="bg-white border border-slate-200 rounded-xl2 shadow-panel p-5 animate-pulse">
              <div className="flex gap-5">
                <div className="h-28 w-28 rounded-2xl bg-slate-100 shrink-0" />
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="h-10 bg-slate-100 rounded-lg" />
                  <div className="h-10 bg-slate-100 rounded-lg" />
                  <div className="h-10 bg-slate-100 rounded-lg" />
                  <div className="h-10 bg-slate-100 rounded-lg" />
                </div>
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl2 shadow-panel p-5 animate-pulse"
              >
                <div className="h-5 w-32 bg-slate-100 rounded-md mb-4" />
                <div className="h-10 bg-slate-100 rounded-lg mb-3" />
                <div className="h-10 bg-slate-100 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-8 py-5 sm:py-7 max-w-full">
        <h1 className="font-display text-2xl font-semibold text-ink-900 tracking-tight">
          My Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Your developer profile — photo, education, skills, projects and resume in one place.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Header card: photo + name + age + course - blue gradient banner for strong top-of-page identity */}
          <div className="relative bg-white border border-slate-200 rounded-xl2 shadow-panel overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-brand-600 via-brand-500 to-ink-700" />
            <div className="px-5 pb-5 -mt-10">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="shrink-0">
                  <div className="p-1 bg-white rounded-2xl shadow-card inline-block">
                    <ProfilePhotoUpload photoPath={user?.profilePhoto} onUpload={handlePhotoUpload} name={form.name} />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:mt-11">
                  <div className="relative">
                    <Input label="Full name" name="name" value={form.name} onChange={handleChange} className="pl-10" />
                    <User size={15} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
                  </div>
                  <div className="relative">
                    <Input label="Age" name="age" value={form.age} onChange={handleChange} placeholder="e.g. 21" className="pl-10" />
                    <Calendar size={15} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
                  </div>
                  <div className="relative">
                    <Input label="Phone number" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="pl-10" />
                    <Phone size={15} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
                  </div>
                  <div className="relative">
                    <Input label="Current location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Sector 70, Noida" className="pl-10" />
                    <MapPin size={15} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Textarea
                  label="Short bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="A short summary about yourself — passionate full-stack developer, available immediately, etc."
                  rows={5}
                />
              </div>
            </div>
          </div>

          {/* Education - navy accent */}
          <SectionCard icon={GraduationCap} title="Education" accent="navy">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Input label="Qualification" name="qualification" value={form.qualification} onChange={handleChange} placeholder="B.Tech in Computer Science & Engineering" className="pl-10" />
                <GraduationCap size={15} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
              </div>
              <div className="relative">
                <Input label="College / University" name="college" value={form.college} onChange={handleChange} className="pl-10" />
                <School size={15} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
              </div>
              <div className="relative">
                <Input label="Course duration / Graduation year" name="graduationYear" value={form.graduationYear} onChange={handleChange} placeholder="e.g. Nov 2022 - Jun 2026" className="pl-10" />
                <Calendar size={15} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
              </div>
              <div className="relative">
                <Input label="CGPA / Percentage" name="cgpa" value={form.cgpa} onChange={handleChange} placeholder="e.g. 7.57 / 10" className="pl-10" />
                <Award size={15} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
              </div>
            </div>
          </SectionCard>

          {/* Skills - indigo accent */}
          <SectionCard icon={Cpu} title="Technical Skills" subtitle="Grouped the same way recruiters scan a resume" accent="indigo">
            <div className="space-y-4">
              {skillFieldConfig.map(({ key, label, icon: Icon, placeholder }) => (
                <div className="relative" key={key}>
                  <Input
                    label={label}
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="pl-10"
                  />
                  <Icon size={15} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Projects - teal accent */}
          <SectionCard
            icon={FolderGit2}
            title="Projects"
            accent="teal"
            action={
              <button
                type="button"
                onClick={handleAddProject}
                className="focus-ring inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 px-2.5 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
              >
                <Plus size={13} />
                Add project
              </button>
            }
          >
            <div className="space-y-4">
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  index={index}
                  project={project}
                  onChange={handleProjectChange}
                  onRemove={handleRemoveProject}
                />
              ))}
              {projects.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-6">No projects added yet.</p>
              )}
            </div>
          </SectionCard>

          {/* Profile links - amber accent */}
          <SectionCard icon={Link2} title="Professional Links" accent="amber">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Input label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="pl-10" />
                <Briefcase size={15} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
              </div>
              <div className="relative">
                <Input label="GitHub" name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..." className="pl-10" />
                <Code size={15} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
              </div>
              <div className="relative">
                <Input label="LeetCode" name="leetcode" value={form.leetcode} onChange={handleChange} placeholder="https://leetcode.com/u/..." className="pl-10" />
                <ExternalLink size={15} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
              </div>
              <div className="relative">
                <Input label="Portfolio website" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://..." className="pl-10" />
                <ExternalLink size={15} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
              </div>
            </div>

            {/* Preview boxes - like the portfolio's "Professional Profiles" section */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <ProfileLinkBox icon={Briefcase} label="LinkedIn" url={form.linkedin} color="brand" />
              <ProfileLinkBox icon={Code} label="GitHub" url={form.github} color="ink" />
              <ProfileLinkBox icon={ExternalLink} label="LeetCode" url={form.leetcode} color="pending" />
              <ProfileLinkBox icon={ExternalLink} label="Portfolio" url={form.portfolio} color="positive" />
            </div>
          </SectionCard>

          {/* Security note */}
          <div className="flex items-start gap-2.5 bg-brand-50/60 border border-brand-100 rounded-xl2 px-4 py-3">
            <Lock size={15} className="text-brand-600 mt-0.5 shrink-0" />
            <p className="text-xs text-brand-800 leading-relaxed">
              Your profile is protected behind JWT-authenticated routes — only you can view or edit
              this data after signing in.
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={saving}>
              <Save size={16} />
              Save profile
            </Button>
          </div>
        </form>

        {/* Resume - full embedded viewer with download, outside the form so file actions don't trigger profile save */}
        <div className="mt-5">
          <ResumeViewer
            resumeFile={user?.resumeFile}
            resumeFileName={user?.resumeFileName}
            onUpload={handleResumeUpload}
            onDelete={handleResumeDelete}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
