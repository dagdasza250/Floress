# Struktura Firestore (kolekcje)

Opis drzewa kolekcji i dokumentów:

```text
users/{uid}
  profiles/{uid} -> { displayName, createdAt, preferences }
  conversations/{cid} -> { title, createdAt, updatedAt, moodAtStart, keyConcepts[] }
    messages/{mid} -> { role: "user"|"assistant", text, ts }
  journalEntries/{jid} -> { ts, title?, cipherText, iv, tag }  // szyfrowane
  moodEntries/{mid} -> { ts, mood:int, tags:string[] }
  progress/{pid} -> { metric, value, ts }  // do Ogrodu
```

Uwagi:
- journalEntries: dane szyfrowane po stronie klienta (cipherText, iv, tag).
- ts/createdAt/updatedAt: Firestore Timestamp.