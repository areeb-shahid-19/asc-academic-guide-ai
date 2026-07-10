import { Link } from "@tanstack/react-router";
import { FileUp, Sparkles, BookOpen, Home } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import logoUrl from "@/assets/logo.png";

export function Header() {
  return (
    <header className="w-full bg-[color:var(--persian-blue)] text-white">
      <div className="relative mx-auto flex items-center justify-between px-4 py-3 md:py-4">
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
            <SheetHeader className="items-center text-center">
              <SheetTitle className="font-crest text-xl font-semibold uppercase tracking-widest text-[color:var(--persian-blue)]">
                Areeb Shahid Academy
              </SheetTitle>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-2">
              <SheetClose asChild>
                <Link
                  to="/"
                  className="flex items-start gap-3 rounded-lg border p-4 hover:bg-accent transition"
                >
                  <Home className="mt-0.5 h-5 w-5 text-[color:var(--persian-blue)]" />
                  <div>
                    <div className="font-semibold">Home</div>
                    <div className="text-sm text-muted-foreground">
                      Back to the welcome page and class tiles.
                    </div>
                  </div>
                </Link>
              </SheetClose>

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
          aria-label="Areeb Shahid Academy — Home"
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
        >
          <img
            src={logoUrl}
            alt="Areeb Shahid Academy logo"
            width={1024}
            height={1024}
            className="h-14 w-auto sm:h-16 md:h-20 object-contain drop-shadow-sm"
          />
        </Link>

        {/* Right-side spacer to balance the hamburger */}
        <span aria-hidden className="w-10 h-10" />
      </div>
    </header>
  );
}
