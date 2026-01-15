import HeroSection from "@/components/project-form";
import ProjectList from "@/components/projectlist";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <ProjectList />
      </div>
    </div>
  );
}
