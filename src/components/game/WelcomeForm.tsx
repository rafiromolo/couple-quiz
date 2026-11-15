import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const NAME_KEY = "cq:name";
const NAME_MAX = 20;
const CODE_LENGTH = 5;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

type Mode = "create" | "join";

const field =
  "w-full min-h-12 rounded-xl border-[3px] border-ink bg-paper px-4 font-ui text-ink shadow-brutal-sm " +
  "placeholder:text-cocoa/60 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink";

function cleanName(raw: string) {
  return raw.replace(/\s+/g, " ").trim().slice(0, NAME_MAX);
}

function cleanCode(raw: string) {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, CODE_LENGTH);
}

// TODO: ganti dengan permintaan ke server. Kode yang dibuat di client bisa bentrok
// dengan room lain, jadi server yang harus membuat dan memvalidasinya.
function createRoomCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

export function WelcomeForm() {
  const [mode, setMode] = useState<Mode>("create");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  // Dibaca di effect, bukan di useState, agar HTML server dan client tetap sama.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_KEY);
      if (saved) setName(cleanName(saved));
    } catch {
      // localStorage bisa dinonaktifkan (mode privat). Abaikan.
    }
  }, []);

  useEffect(() => {
    if (mode === "join") codeRef.current?.focus();
  }, [mode]);

  function switchMode(next: Mode) {
    setError(null);
    setMode(next);
  }

  function enterRoom(roomCode: string, playerName: string) {
    try {
      localStorage.setItem(NAME_KEY, playerName);
    } catch {
      // Abaikan: nama hanya tidak terisi otomatis di kunjungan berikutnya.
    }
    window.location.href = `/room?c=${roomCode}`;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const playerName = cleanName(name);

    if (!playerName) {
      setError("Isi nama panggilan dulu ya.");
      return;
    }

    if (mode === "create") {
      enterRoom(createRoomCode(), playerName);
      return;
    }

    if (code.length !== CODE_LENGTH) {
      setError(`Kode room terdiri dari ${CODE_LENGTH} karakter.`);
      return;
    }
    enterRoom(code, playerName);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="player-name" className="font-ui font-medium text-cocoa">
          Nama panggilan
        </label>
        <input
          type="text"
          id="player-name"
          value={name}
          maxLength={NAME_MAX}
          autoComplete="nickname"
          placeholder="Contoh: Sadie"
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          className={field}
        />
      </div>

      {mode === "join" && (
        <div className="flex flex-col gap-2">
          <label htmlFor="room-code" className="font-ui font-medium text-cocoa">
            Kode room
          </label>
          <input
            id="room-code"
            ref={codeRef}
            type="text"
            value={code}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="ABCDE"
            onChange={(e) => {
              setCode(cleanCode(e.target.value));
              setError(null);
            }}
            className={cn(field, "text-center font-display text-2xl tracking-widest")}
          />
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-xl border-[3px] border-ink bg-mustard px-4 py-2 font-ui text-ink"
        >
          {error}
        </p>
      )}

      <Button type="submit" className="w-full">
        {mode === "create" ? "Buat room" : "Gabung"}
      </Button>

      <button
        type="button"
        onClick={() => switchMode(mode === "create" ? "join" : "create")}
        className="min-h-12 font-ui text-cocoa underline underline-offset-4 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {mode === "create" ? "Sudah punya kode? Gabung" : "Belum punya kode? Buat room baru"}
      </button>
    </form>
  );
}
