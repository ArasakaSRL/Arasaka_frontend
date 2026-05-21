import {
  ExternalLink,
  Link2Off,
} from "lucide-react";

interface Props {
  githubUrl: string | null;
  demoUrl: string | null;
}

export const ProyectoLinks = ({
  githubUrl,
  demoUrl,
}: Props) => {

  return (
    <div className="flex gap-10 bg-secondary-500 p-3 px-8 rounded-3xl">

      {/* GITHUB */}

      {githubUrl ? (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className=" flex-1 h-15 rounded-2xl bg-white flex items-center justify-center hover:bg-gray-100 transition shadow-sm"
        >
          <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" 
                    className="w-8 h-8" 
                    alt="GitHub" 
                  />
        </a>
      ) : (
        <div
          className="flex-1 h-15 rounded-2xl bg-white flex items-center justify-center hover:bg-gray-100 transition shadow-smborder-dashed"
        >
          <Link2Off size={26} />
        </div>
      )}

      {demoUrl ? (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className=" flex-1 h-15 text-black rounded-2xl bg-white flex items-center justify-center hover:bg-gray-100 transition shadow-sm
          "
        >
          <ExternalLink size={32} />
        </a>
      ) : (
        <div
          className=" flex-1 rounded-2xl bg-gray-100 flex flex-col items-center justify-center text-gray-400 border border-dashed
          "
        >
          <Link2Off size={26} />
        </div>
      )}
    </div>
  );
};