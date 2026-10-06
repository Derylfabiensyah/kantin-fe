import { useState, useEffect, useMemo } from 'react'
import {
  ShieldCheck,
  Search,
  RefreshCw,
  PhoneOff,
  Smartphone,
  Sliders,
  CheckCircle2,
  UtensilsCrossed,
  DollarSign,
  ShoppingCart,
  Info,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search as SearchComp } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { formatRupiah } from '@/lib/formatters'
import { MOCK_SISWA, type KartuSiswaMock } from '@/mocks/mock-data'
import { LimitBlokirForm } from './LimitBlokirForm'

export function KontrolSiswaPage() {
  const [students, setStudents] = useState<KartuSiswaMock[]>(MOCK_SISWA)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [appFilter, setAppFilter] = useState<string>('ALL')
  const [limitFilter, setLimitFilter] = useState<string>('ALL')

  // Selected student for LimitBlokirForm
  const [selectedStudent, setSelectedStudent] = useState<KartuSiswaMock | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    let isMounted = true
    const loadInitialData = async () => {
      try {
        const res = await apiClient
          .get('/api/v1/kontrol-siswa')
          .catch(() => apiClient.get('/api/v1/tu/siswa'))
        if (isMounted && res.data?.data && Array.isArray(res.data.data)) {
          setStudents(res.data.data)
        }
      } catch {
        // Fallback
      }
    }
    void loadInitialData()
    return () => {
      isMounted = false
    }
  }, [])

  const refreshStudents = async () => {
    setIsLoading(true)
    try {
      const res = await apiClient
        .get('/api/v1/kontrol-siswa')
        .catch(() => apiClient.get('/api/v1/tu/siswa'))
      if (res.data?.data && Array.isArray(res.data.data)) {
        setStudents(res.data.data)
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false)
    }
  }

  // KPI Calculations
  const nonAppCount = useMemo(() => {
    return students.filter((s) => !s.parent_app_registered).length
  }, [students])

  const limitActiveCount = useMemo(() => {
    return students.filter((s) => s.limit_harian_enabled !== false && s.limit_harian > 0).length
  }, [students])

  const menuBlockCount = useMemo(() => {
    return students.filter(
      (s) =>
        (s.blocked_items && s.blocked_items.length > 0) ||
        (s.blocked_categories && s.blocked_categories.length > 0)
    ).length
  }, [students])

  // Filtered List
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // App Filter
      if (appFilter === 'NON_APP' && s.parent_app_registered) return false
      if (appFilter === 'APP' && !s.parent_app_registered) return false

      // Limit Filter
      if (limitFilter === 'WITH_LIMIT') {
        const hasLimit = s.limit_harian_enabled !== false && s.limit_harian > 0
        if (!hasLimit) return false
      }
      if (limitFilter === 'NO_LIMIT') {
        const hasLimit = s.limit_harian_enabled !== false && s.limit_harian > 0
        if (hasLimit) return false
      }
      if (limitFilter === 'WITH_BLOCK') {
        const hasBlock =
          (s.blocked_items && s.blocked_items.length > 0) ||
          (s.blocked_categories && s.blocked_categories.length > 0)
        if (!hasBlock) return false
      }

      // Search
      const q = searchQuery.toLowerCase().trim()
      if (q) {
        return (
          s.nama.toLowerCase().includes(q) ||
          s.nis.toLowerCase().includes(q) ||
          s.kelas.toLowerCase().includes(q) ||
          (s.parent_name && s.parent_name.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [students, appFilter, limitFilter, searchQuery])

  const handleSaveSuccess = (updatedStudent: KartuSiswaMock) => {
    setStudents((prev) =>
      prev.map((s) => (s.siswa_id === updatedStudent.siswa_id ? updatedStudent : s))
    )
  }

  // Quick live validator test for demo / verification
  const handleTestCashierValidation = async (studentToTest: KartuSiswaMock) => {
    // Sample cart: Nasi Uduk (ID 1, Kat 1) + Es Teh Manis (ID 9, Kat 3)
    const testItems = [
      { menu_id: 1, qty: 1 },
      { menu_id: 9, qty: 1 },
    ]

    try {
      const res = await apiClient.post('/api/v1/kasir/transaksi', {
        kartu_uid: studentToTest.uid,
        items: testItems,
      })
      if (res.data?.status === 'SUCCESS') {
        const total = (res.data?.data?.total || 16000) as number
        toast.success(`Uji Validasi Kasir: LOLOS`, {
          description: `Siswa ${studentToTest.nama} lolos membeli Nasi Uduk & Es Teh (${formatRupiah(total)}).`,
        })
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      const msg = axiosErr.response?.data?.message || 'Transaksi ditolak kasir'
      toast.error(`Uji Validasi Kasir: DITOLAK`, {
        description: `Kasir menolak ${studentToTest.nama}: ${msg}`,
      })
    }
  }

  return (
    <>
      <Header>
        <SearchComp />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-6'>
        {/* Title Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <ShieldCheck className='h-5 w-5' />
              </div>
              <h1 className='text-2xl font-bold tracking-tight'>
                Kontrol Siswa atas Nama Orang Tua
              </h1>
            </div>
            <p className='text-sm text-muted-foreground mt-1'>
              Modul Admin Sekolah: Pengaturan Batas Limit Belanja & Larangan Menu Siswa (PRD §9.6)
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => void refreshStudents()}
              disabled={isLoading}
              className='gap-1.5'
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Banner Penjelasan Perwalian Admin */}
        <Alert className='bg-primary/5 border-primary/20 text-slate-900 dark:text-slate-100'>
          <Info className='h-4 w-4 text-primary' />
          <AlertTitle className='font-semibold text-xs tracking-wide'>
            Perwalian Admin Sekolah untuk Orang Tua Non-Aplikasi (PRD §9.6)
          </AlertTitle>
          <AlertDescription className='text-xs mt-1 leading-relaxed text-muted-foreground'>
            Modul ini diperuntukkan bagi <strong>Admin Sekolah & TU</strong> untuk mewakili orang tua
            yang belum menggunakan aplikasi mobile SKOOLIA. Pengaturan batas belanja harian dan blokir
            menu kategori maupun item spesifik yang disimpan di sini akan{' '}
            <strong>langsung tersimpan dan berlaku secara real-time pada validasi kasir POS</strong>{' '}
            (PRD §6.1 Tahap 3 & 5).
          </AlertDescription>
        </Alert>

        {/* KPI Cards Ringkasan */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card className='shadow-sm'>
            <CardHeader className='pb-2'>
              <CardDescription className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Total Siswa Terdaftar
              </CardDescription>
              <CardTitle className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
                {students.length} Siswa
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-0 text-[11px] text-muted-foreground'>
              Siswa aktif pemegang kartu RFID
            </CardContent>
          </Card>

          <Card className='shadow-sm border-amber-300/70 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20'>
            <CardHeader className='pb-2'>
              <CardDescription className='text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider'>
                Ortu Belum Pakai App
              </CardDescription>
              <CardTitle className='text-2xl font-bold font-mono text-amber-700 dark:text-amber-300 flex items-center gap-2'>
                <PhoneOff className='h-5 w-5 text-amber-600' />
                <span>{nonAppCount} Siswa</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-0 text-[11px] text-muted-foreground'>
              Fokus perwalian kontrol admin sekolah
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardHeader className='pb-2'>
              <CardDescription className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Limit Belanja Aktif
              </CardDescription>
              <CardTitle className='text-2xl font-bold text-primary flex items-center gap-2'>
                <DollarSign className='h-5 w-5 text-primary' />
                <span>{limitActiveCount} Siswa</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-0 text-[11px] text-muted-foreground'>
              Maksimal nominal belanja harian
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardHeader className='pb-2'>
              <CardDescription className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Larangan Menu Aktif
              </CardDescription>
              <CardTitle className='text-2xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2'>
                <UtensilsCrossed className='h-5 w-5 text-red-500' />
                <span>{menuBlockCount} Siswa</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-0 text-[11px] text-muted-foreground'>
              Blokir kategori atau menu spesifik
            </CardContent>
          </Card>
        </div>

        {/* Toolbar Pencarian & Filter */}
        <Card className='shadow-sm'>
          <CardContent className='p-4'>
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>
              <div className='relative flex-1'>
                <Search className='absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground' />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Cari nama siswa, NIS, kelas, atau nama orang tua...'
                  className='h-9 pl-8 text-xs'
                />
              </div>

              <div className='flex flex-wrap items-center gap-2'>
                <Select value={appFilter} onValueChange={setAppFilter}>
                  <SelectTrigger className='h-9 text-xs w-[170px]'>
                    <SelectValue placeholder='Status App Ortu' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ALL' className='text-xs'>
                      Semua Akun Ortu
                    </SelectItem>
                    <SelectItem value='NON_APP' className='text-xs'>
                      Belum Pakai App (Fokus)
                    </SelectItem>
                    <SelectItem value='APP' className='text-xs'>
                      Sudah Pakai App
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={limitFilter} onValueChange={setLimitFilter}>
                  <SelectTrigger className='h-9 text-xs w-[170px]'>
                    <SelectValue placeholder='Status Pembatasan' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ALL' className='text-xs'>
                      Semua Pembatasan
                    </SelectItem>
                    <SelectItem value='WITH_LIMIT' className='text-xs'>
                      Ada Limit Harian
                    </SelectItem>
                    <SelectItem value='NO_LIMIT' className='text-xs'>
                      Tanpa Limit Harian
                    </SelectItem>
                    <SelectItem value='WITH_BLOCK' className='text-xs'>
                      Ada Blokir Menu
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabel Siswa */}
        <Card className='shadow-sm'>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-slate-50/70 dark:bg-slate-900/40 text-xs'>
                    <TableHead className='w-[240px]'>Data Siswa</TableHead>
                    <TableHead>Status Aplikasi Ortu</TableHead>
                    <TableHead>Batas Limit Harian</TableHead>
                    <TableHead>Larangan Menu / Kategori</TableHead>
                    <TableHead>Saldo Digital</TableHead>
                    <TableHead className='text-right w-[160px]'>Aksi Kontrol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className='h-32 text-center text-muted-foreground text-xs'>
                        Tidak ada siswa yang sesuai dengan filter pencarian.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((siswa) => {
                      const hasLimit =
                        siswa.limit_harian_enabled !== false && siswa.limit_harian > 0
                      const blockedCatsCount = siswa.blocked_categories?.length || 0
                      const blockedItemsCount = siswa.blocked_items?.length || 0
                      const hasRestrictions = blockedCatsCount > 0 || blockedItemsCount > 0

                      return (
                        <TableRow key={siswa.siswa_id} className='text-xs hover:bg-muted/40'>
                          {/* Data Siswa */}
                          <TableCell>
                            <div className='flex items-center gap-3'>
                              <img
                                src={siswa.foto_url}
                                alt={siswa.nama}
                                className='h-10 w-10 rounded-full object-cover border'
                              />
                              <div>
                                <p className='font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5'>
                                  {siswa.nama}
                                  {siswa.is_blocked && (
                                    <Badge variant='destructive' className='text-[9px] py-0'>
                                      KARTU DIBLOKIR
                                    </Badge>
                                  )}
                                </p>
                                <p className='text-muted-foreground font-mono text-[11px]'>
                                  NIS: {siswa.nis} • {siswa.kelas}
                                </p>
                                <p className='text-[10px] text-muted-foreground'>
                                  Ortu: {siswa.parent_name || 'Orang Tua'}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* Status Aplikasi Ortu */}
                          <TableCell>
                            {siswa.parent_app_registered ? (
                              <Badge
                                variant='outline'
                                className='text-[10px] py-0.5 border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 gap-1'
                              >
                                <Smartphone className='h-3 w-3' />
                                <span>Terhubung App</span>
                              </Badge>
                            ) : (
                              <div className='space-y-0.5'>
                                <Badge
                                  variant='outline'
                                  className='text-[10px] py-0.5 border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40 gap-1'
                                >
                                  <PhoneOff className='h-3 w-3' />
                                  <span>Belum Pakai App</span>
                                </Badge>
                                <p className='text-[10px] text-amber-700 dark:text-amber-400 font-medium'>
                                  Perwalian Admin
                                </p>
                              </div>
                            )}
                          </TableCell>

                          {/* Limit Harian */}
                          <TableCell>
                            {hasLimit ? (
                              <div className='space-y-1'>
                                <Badge
                                  variant='outline'
                                  className='text-[11px] py-0 font-mono font-semibold bg-primary/5 text-primary border-primary/20'
                                >
                                  {formatRupiah(siswa.limit_harian)} / hari
                                </Badge>
                                <div className='text-[10px] text-muted-foreground'>
                                  Belanja hari ini: {formatRupiah(siswa.belanja_hari_ini)}
                                </div>
                              </div>
                            ) : (
                              <span className='inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium'>
                                <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' />
                                Tanpa Limit
                              </span>
                            )}
                          </TableCell>

                          {/* Larangan Menu & Kategori */}
                          <TableCell>
                            {hasRestrictions ? (
                              <div className='space-y-1'>
                                <div className='flex flex-wrap gap-1'>
                                  {blockedCatsCount > 0 && (
                                    <Badge
                                      variant='outline'
                                      className='text-[10px] py-0 border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40'
                                    >
                                      {blockedCatsCount} Kategori Diblokir
                                    </Badge>
                                  )}
                                  {blockedItemsCount > 0 && (
                                    <Badge
                                      variant='destructive'
                                      className='text-[10px] py-0 px-1.5'
                                    >
                                      {blockedItemsCount} Item Spesifik
                                    </Badge>
                                  )}
                                </div>
                                {siswa.catatan_kontrol && (
                                  <p className='text-[10px] text-muted-foreground truncate max-w-[200px] italic'>
                                    "{siswa.catatan_kontrol}"
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className='text-[11px] text-muted-foreground italic'>
                                Tidak ada larangan menu
                              </span>
                            )}
                          </TableCell>

                          {/* Saldo Digital */}
                          <TableCell>
                            <span className='font-mono font-bold text-slate-900 dark:text-slate-100 text-xs'>
                              {formatRupiah(siswa.saldo)}
                            </span>
                          </TableCell>

                          {/* Aksi */}
                          <TableCell className='text-right'>
                            <div className='flex items-center justify-end gap-1.5'>
                              <Button
                                size='sm'
                                variant='ghost'
                                onClick={() => void handleTestCashierValidation(siswa)}
                                title='Uji coba simulasi belanja kasir dengan keranjang berisi Nasi Uduk & Es Teh'
                                className='h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground'
                              >
                                <ShoppingCart className='h-3.5 w-3.5' />
                                <span className='hidden xl:inline'>Uji Kasir</span>
                              </Button>

                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => {
                                  setSelectedStudent(siswa)
                                  setIsFormOpen(true)
                                }}
                                className='h-8 text-xs gap-1.5 border-primary/30 hover:bg-primary/5 hover:text-primary'
                              >
                                <Sliders className='h-3.5 w-3.5' />
                                <span>Atur Limit & Blokir</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Main>

      {/* FORM DIALOG */}
      <LimitBlokirForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        student={selectedStudent}
        onSaveSuccess={handleSaveSuccess}
      />
    </>
  )
}
export default KontrolSiswaPage
