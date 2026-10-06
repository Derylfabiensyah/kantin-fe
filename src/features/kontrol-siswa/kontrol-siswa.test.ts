import { describe, it, expect } from 'vitest'
import { kontrolSiswaFormSchema } from './types'

describe('Kontrol Siswa Zod Validation Schema', () => {
  it('berhasil memvalidasi konfigurasi tanpa limit harian', () => {
    const validData = {
      siswaId: 101,
      limitHarianEnabled: false,
      limitHarian: 0,
      blockedCategories: [3],
      blockedItems: [1, 2],
      catatanKontrol: 'Orang tua melarang jajan minuman dingin',
    }
    const result = kontrolSiswaFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.limitHarianEnabled).toBe(false)
      expect(result.data.blockedCategories).toEqual([3])
      expect(result.data.blockedItems).toEqual([1, 2])
    }
  })

  it('berhasil memvalidasi konfigurasi dengan limit harian aktif valid (>= Rp 5.000)', () => {
    const validData = {
      siswaId: 102,
      limitHarianEnabled: true,
      limitHarian: 25000,
      blockedCategories: [],
      blockedItems: [9],
      catatanKontrol: 'Limit harian Rp 25.000',
    }
    const result = kontrolSiswaFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.limitHarian).toBe(25000)
    }
  })

  it('gagal jika limit harian diaktifkan tetapi nominal di bawah Rp 5.000', () => {
    const invalidData = {
      siswaId: 102,
      limitHarianEnabled: true,
      limitHarian: 3000, // < 5000
      blockedCategories: [],
      blockedItems: [],
    }
    const result = kontrolSiswaFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('limitHarian'))
      expect(issue?.message).toContain('nominal minimum adalah Rp 5.000')
    }
  })

  it('gagal jika nominal limit negatif', () => {
    const invalidData = {
      siswaId: 101,
      limitHarianEnabled: false,
      limitHarian: -10000,
      blockedCategories: [],
      blockedItems: [],
    }
    const result = kontrolSiswaFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
