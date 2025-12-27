import HeroSection from "@/components/project-form";
import ProjectList from "@/components/projectlist";

export default function Home() {
  return (
    <div className="flex items-center justify-center w-full px-4 py-8">

      <div className="max-w-5xl w-full">
        <section className="flex flex-col items-center">
          <div className="max-w-3xl w-full">
            <HeroSection />
          </div>
          <ProjectList/>
        </section>
      </div>
    </div>
  );
}
