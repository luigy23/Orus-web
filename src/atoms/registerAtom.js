import { atom } from "jotai"

export const registerAtom = atom(null, async (get, set, formData) => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json()
    return data
  } catch (err) {
    return { success: false, error: "Error de red al registrar" }
  }
})
