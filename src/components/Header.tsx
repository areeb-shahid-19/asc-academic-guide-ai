import { Link } from "@tanstack/react-router";
import { Menu, FileUp, Sparkles, BookOpen } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="w-full bg-[color:var(--persian-blue)] text-white">
      <div className="relative mx-auto flex items-center justify-between px-4 py-4 md:py-5">
        <Sheet>
          <SheetTrigger
            aria-label="Open menu"
            className="flex flex-col justify-center gap-[5px] p-2 rounded-md hover:bg-white/10 transition"
          >
            <span className="block h-[3px] w-7 bg-white rounded-full" />
            <span className="block h-[3px] w-7 bg-white rounded-full" />
            <span className="block h-[3px] w-7 bg-white rounded-full" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] sm:w-[380px]">
            <SheetHeader>
              <SheetTitle className="font-academy text-xl tracking-wide">
                AREEB SHAHID ACADEMY
              </SheetTitle>
              <SheetDescription>Choose how you want to study today.</SheetDescription>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-2">
              <SheetClose asChild>
                <Link
                  to="/upload"
                  className="flex items-start gap-3 rounded-lg border p-4 hover:bg-accent transition"
                >
                  <FileUp className="mt-0.5 h-5 w-5 text-[color:var(--persian-blue)]" />
                  <div>
                    <div className="font-semibold">Upload your material</div>
                    <div className="text-sm text-muted-foreground">
                      Paste or upload notes / a chapter — the AI reads it and explains it to you.
                    </div>
                  </div>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  to="/topic"
                  className="flex items-start gap-3 rounded-lg border p-4 hover:bg-accent transition"
                >
                  <Sparkles className="mt-0.5 h-5 w-5 text-[color:var(--persian-blue)]" />
                  <div>
                    <div className="font-semibold">Ask about a topic</div>
                    <div className="text-sm text-muted-foreground">
                      Pick class, subject &amp; chapter, then ask any question. AI explains at your level.
                    </div>
                  </div>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  to="/chapter"
                  className="flex items-start gap-3 rounded-lg border p-4 hover:bg-accent transition"
                >
                  <BookOpen className="mt-0.5 h-5 w-5 text-[color:var(--persian-blue)]" />
                  <div>
                    <div className="font-semibold">Explain full chapter</div>
                    <div className="text-sm text-muted-foreground">
                      Complete NCERT chapter: concepts, derivations, diagrams, NCERT questions &amp; solutions.
                    </div>
                  </div>
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>

        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 font-academy text-lg sm:text-2xl md:text-3xl font-bold tracking-wider text-white uppercase whitespace-nowrap"
        >
          Areeb Shahid Academy
        </Link>

        {/* Right-side spacer to balance the hamburger */}
        <span aria-hidden className="w-10 h-10" />
      </div>
    </header>
  );
}
