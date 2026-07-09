import { CURRICULUM, CLASS_KEYS } from "@/lib/curriculum";
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
  const cls = CURRICULUM[value.classKey];
  const subj = cls?.subjects.find((s) => s.name === value.subject);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-1.5">
        <Label>Class</Label>
        <Select
          value={value.classKey}
          onValueChange={(v) => onChange({ classKey: v, subject: "", chapter: "" })}
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

      <div className="space-y-1.5">
        <Label>Subject</Label>
        <Select
          value={value.subject}
          onValueChange={(v) => onChange({ ...value, subject: v, chapter: "" })}
          disabled={!cls}
        >
          <SelectTrigger>
            <SelectValue placeholder={cls ? "Select subject" : "Pick class first"} />
          </SelectTrigger>
          <SelectContent>
            {cls?.subjects.map((s) => (
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
