import { Trash2, ExternalLink, Code } from "lucide-react";
import { Input, Textarea } from "../ui/FormFields";

const ProjectCard = ({ index, project, onChange, onRemove }) => {
  const handleField = (field, value) => {
    onChange(index, { ...project, [field]: value });
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-1 rounded-md">
          Project {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="focus-ring h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:text-negative-600 hover:bg-negative-50 transition-colors"
          title="Remove project"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="space-y-3">
        <Input
          label="Project title"
          placeholder="e.g. AI-Powered SaaS Web App"
          value={project.title}
          onChange={(e) => handleField("title", e.target.value)}
        />

        <Input
          label="Tech stack"
          placeholder="e.g. React.js, Tailwind CSS, Node.js, Express.js, MongoDB"
          value={project.techStack}
          onChange={(e) => handleField("techStack", e.target.value)}
        />

        <Textarea
          label="Description (one point per line)"
          placeholder={"Engineered a scalable full-stack platform...\nIntegrated APIs to deliver high-accuracy results...\nDesigned and deployed secure authentication..."}
          rows={8}
          value={project.description}
          onChange={(e) => handleField("description", e.target.value)}
        />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GitHub Link */}
          <div className="relative">
            <Input
              label="GitHub Repository"
              placeholder="https://github.com/username/project"
              value={project.githubLink}
              onChange={(e) => handleField("githubLink", e.target.value)}
              className="pl-12 pr-14 h-14 bg-white border-slate-300 focus:border-violet-500 focus:ring-violet-100"
            />

            {/* Left Icon */}
            <div className="absolute left-3 top-[2.3rem] flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-sm">
              <Code size={15} />
            </div>

            {/* Open Button */}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                title="Open GitHub Repository"
                className="absolute right-2 top-[2.15rem] flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300"
              >
                <ExternalLink size={15} />
              </a>
            )}
          </div>

          {/* Live Demo Link */}
          <div className="relative">
            <Input
              label="Live Demo"
              placeholder="https://your-project.com"
              value={project.liveLink}
              onChange={(e) => handleField("liveLink", e.target.value)}
              className="pl-12 pr-14 h-14 bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
            />

            {/* Left Icon */}
            <div className="absolute left-3 top-[2.3rem] flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <ExternalLink size={15} />
            </div>

            {/* Open Button */}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                title="Open Live Demo"
                className="absolute right-2 top-[2.15rem] flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300"
              >
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>

       
        
      </div>
    </div>
  );
};

export default ProjectCard;
