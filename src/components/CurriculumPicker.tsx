import {
  CURRICULUM,
  CLASS_KEYS,
  STREAM_KEYS,
  classHasStreams,
  subjectsFor,
} from "@/lib/curriculum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type PickerValue = {
  classKey: string;
  stream: string;
  subject: string;
  chapter: string;
};

export function CurriculumPicker({
  value,
  onChange,
}: {
  value: PickerValue;
  onChange: (v: PickerValue) => void;
}) {
  const needsStream = classHasStreams(value.classKey);
  const subjects = needsStream
    ? value.stream
      ? subjectsFor(value.classKey, value.stream)
      : []
    : subjectsFor(value.classKey, "");
  const subj = subjects.find((s) => s.name === value.subject);

  const gridCols = needsStream ? "sm:grid-cols-4" : "sm:grid-cols-3";

  return (
    <div className={`grid gap-4 ${gridCols}`}>
      <div className="space-y-1.5">
        <Label>Class</Label>
        <Select
          value={value.classKey}
          onValueChange={(v) =>
            onChange({ classKey: v, stream: "", subject: "", chapter: "" })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {CLASS_KEYS.map((k) => (
              <SelectItem key={k} value={k}>
                {CURRICULUM[k].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {needsStream && (
        <div className="space-y-1.5">
          <Label>Stream</Label>
          <Select
            value={value.stream}
            onValueChange={(v) =>
              onChange({ ...value, stream: v, subject: "", chapter: "" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select stream" />
            </SelectTrigger>
            <SelectContent>
              {STREAM_KEYS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Subject</Label>
        <Select
          value={value.subject}
          onValueChange={(v) => onChange({ ...value, subject: v, chapter: "" })}
          disabled={subjects.length === 0}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                subjects.length === 0
                  ? needsStream && !value.stream
                    ? "Pick stream first"
                    : "Pick class first"
                  : "Select subject"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.name} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Chapter</Label>
        <Select
          value={value.chapter}
          onValueChange={(v) => onChange({ ...value, chapter: v })}
          disabled={!subj}
        >
          <SelectTrigger>
            <SelectValue placeholder={subj ? "Select chapter" : "Pick subject first"} />
          </SelectTrigger>
          <SelectContent>
            {subj?.chapters.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
