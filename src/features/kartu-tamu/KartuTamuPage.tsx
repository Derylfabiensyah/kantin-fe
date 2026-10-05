import { useState, useEffect } from 'react'
import {
  CreditCard,
  RefreshCw,
  Plus,
  Wallet,
  ArrowLeftRight,
  ShieldAlert,
  ShieldCheck,
  PackageOpen,
  TrendingUp,
  Eye,
  Search,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search as SearchComp } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import apiClient from '@/lib/api-client'
import { MOCK_KARTU_TAMU, type KartuTamuMock } from '@/mocks/mock-data'
import { RegisterKartuModal } from './RegisterKartuModal'
import { TopupKartuTamuModal } from './TopupKartuTamuModal'
import { RefundKartuModal } from './RefundKartuModal'
import { BlokirKartuModal } from './BlokirKartuModal'
import { KartuTamuSlipModal, type KartuTamuSlipData } from './KartuTamuSlipModal'

type ModalType = 'register' | 'topup' | 'refund' | 'blokir' | null

const STATUS_CONFIG = {
  ACTIVE: {
    label: 'Aktif',
    className:
      'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800',
    icon: ShieldCheck,
  },
  BLOCKED: {
    label: 'Diblokir',
    className:
      'bg-red-100 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800',
    icon: ShieldAlert,
  },
  AVAILABLE: {
    label: 'Tersedia',
    className:
      'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    icon: PackageOpen,
  },
}

export function KartuTamuPage() {
  const [cards, setCards] = useState<KartuTamuMock[]>(MOCK_KARTU_TAMU)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedCard, setSelectedCard] = useState<KartuTamuMock | null>(null)
  const [slipData, setSlipData] = useState<KartuTamuSlipData | null>(null)
  const [isSlipOpen, setIsSlipOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setIsLoading(true)
      try {
        const res = await apiClient.get('/api/v1/tu/kartu-tamu')
        if (isMounted && res.data?.data) setCards(res.data.data as KartuTamuMock[])
      } catch {
        if (isMounted) setCards(MOCK_KARTU_TAMU)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    void load()
    return () => { isMounted = false }
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const res = await apiClient.get('/api/v1/tu/kartu-tamu')
      if (res.data?.data) setCards(res.data.data as KartuTamuMock[])
    } catch {
      setCards(MOCK_KARTU_TAMU)
    } finally {
      setIsLoading(false)
    }
  }

  const openModal = (type: ModalType, card?: KartuTamuMock) => {
    setSelectedCard(card ?? null)
    setActiveModal(type)
  }

  const closeModal = () => {
    setActiveModal(null)
    setSelectedCard(null)
  }

  const showSlip = (data: KartuTamuSlipData) => {
    setSlipData(data)
    setIsSlipOpen(true)
  }

  // --- Handlers ---
  const handleRegistered = (newCard: KartuTamuMock) => {
    setCards((prev) => [...prev, newCard])
  }

  const handleTopupSuccess = (kartuId: number, saldoBaru: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === kartuId ? { ...c, saldo: saldoBaru } : c))
    )
  }

  const handleRefundSuccess = (kartuId: number) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === kartuId
          ? { ...c, saldo: 0, label_pemegang: '', status: 'AVAILABLE', is_active: false }
          : c
      )
    )
  }

  const handleBlokirSuccess = (kartuId: number, transferToId?: number) => {
    setCards((prev) => {
      const blocked = prev.find((c) => c.id === kartuId)
      return prev.map((c) => {
        if (c.id === kartuId) {
          return { ...c, status: 'BLOCKED', is_active: false, saldo: 0 }
        }
        if (transferToId && c.id === transferToId && blocked) {
          return { ...c, saldo: c.saldo + blocked.saldo }
        }
        return c
      })
    })
  }

  // --- Stats ---
  const totalAktif = cards.filter((c) => c.status === 'ACTIVE').length
  const totalSaldo = cards
    .filter((c) => c.status === 'ACTIVE')
    .reduce((sum, c) => sum + c.saldo, 0)
  const totalDiblokir = cards.filter((c) => c.status === 'BLOCKED').length
  const totalTersedia = cards.filter((c) => c.status === 'AVAILABLE').length

  // --- Filter ---
  const filteredCards = cards.filter((c) => {
    const q = searchQuery.toLowerCase()
    return (
      c.nomor_kartu.toLowerCase().includes(q) ||
      c.label_pemegang.toLowerCase().includes(q) ||
      c.uid.toLowerCase().includes(q)
    )
  })

  return (
    <>
      <Header fixed>
        <SearchComp />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='space-y-6 pb-10'>
          {/* Page Header */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2.5 bg-primary/10 text-primary rounded-xl'>
                <CreditCard className='h-6 w-6' />
              </div>
              <div>
                <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
                  Manajemen Kartu Tamu
                </h1>
                <p className='text-sm text-muted-foreground'>
                  Registrasi, top-up, pengembalian, dan blokir Kartu Tamu RFID
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2 self-start sm:self-auto'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleRefresh}
                disabled={isLoading}
                className='text-xs gap-1.5'
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                size='sm'
                onClick={() => openModal('register')}
                className='text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow'
              >
                <Plus className='h-4 w-4' />
                Daftarkan Kartu Baru
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
            <SummaryCard
              label='Kartu Aktif'
              value={totalAktif}
              icon={ShieldCheck}
              colorClass='bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
              badgeClass='text-emerald-600'
            />
            <SummaryCard
              label='Total Saldo Beredar'
              value={`Rp ${totalSaldo.toLocaleString('id-ID')}`}
              icon={TrendingUp}
              colorClass='bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
              badgeClass='text-blue-600'
              isRupiah
            />
            <SummaryCard
              label='Kartu Diblokir'
              value={totalDiblokir}
              icon={ShieldAlert}
              colorClass='bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400'
              badgeClass='text-red-600'
            />
            <SummaryCard
              label='Kartu Tersedia'
              value={totalTersedia}
              icon={PackageOpen}
              colorClass='bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              badgeClass='text-slate-500'
            />
          </div>

          {/* Table Section */}
          <div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden'>
            {/* Table Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-800'>
              <h2 className='text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide'>
                Daftar Kartu Tamu ({filteredCards.length})
              </h2>
              <div className='relative max-w-xs w-full'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                <Input
                  placeholder='Cari nomor, label, atau UID...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-9 h-9 text-sm'
                />
              </div>
            </div>

            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-slate-50 dark:bg-slate-900/60'>
                    <TableHead className='text-xs font-bold uppercase tracking-wide text-slate-500 w-[110px]'>
                      No. Kartu
                    </TableHead>
                    <TableHead className='text-xs font-bold uppercase tracking-wide text-slate-500'>
                      Label Pemegang
                    </TableHead>
                    <TableHead className='text-xs font-bold uppercase tracking-wide text-slate-500'>
                      UID RFID
                    </TableHead>
                    <TableHead className='text-xs font-bold uppercase tracking-wide text-slate-500 text-right'>
                      Saldo
                    </TableHead>
                    <TableHead className='text-xs font-bold uppercase tracking-wide text-slate-500 text-center'>
                      Status
                    </TableHead>
                    <TableHead className='text-xs font-bold uppercase tracking-wide text-slate-500 text-center'>
                      Terakhir Dipakai
                    </TableHead>
                    <TableHead className='text-xs font-bold uppercase tracking-wide text-slate-500 text-center w-[180px]'>
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCards.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className='text-center py-12'>
                        <div className='flex flex-col items-center gap-2 text-muted-foreground'>
                          <CreditCard className='h-10 w-10 opacity-30' />
                          <p className='text-sm font-medium'>Tidak ada kartu ditemukan</p>
                          {searchQuery && (
                            <p className='text-xs'>
                              Coba ubah kata kunci pencarian
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredCards.map((card) => {
                    const statusCfg = STATUS_CONFIG[card.status]
                    const StatusIcon = statusCfg.icon
                    const isActive = card.status === 'ACTIVE'
                    const isBlocked = card.status === 'BLOCKED'

                    return (
                      <TableRow
                        key={card.id}
                        className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30 ${
                          isBlocked ? 'opacity-60' : ''
                        }`}
                      >
                        {/* Nomor Kartu */}
                        <TableCell>
                          <span className='font-mono font-bold text-sm text-slate-900 dark:text-slate-100'>
                            {card.nomor_kartu}
                          </span>
                        </TableCell>

                        {/* Label */}
                        <TableCell>
                          <span className='text-sm text-slate-700 dark:text-slate-300'>
                            {card.label_pemegang || (
                              <span className='text-muted-foreground italic text-xs'>
                                (Kosong)
                              </span>
                            )}
                          </span>
                        </TableCell>

                        {/* UID */}
                        <TableCell>
                          <code className='text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded'>
                            {card.uid}
                          </code>
                        </TableCell>

                        {/* Saldo */}
                        <TableCell className='text-right'>
                          <span
                            className={`font-mono font-bold text-sm ${
                              isActive
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-400'
                            }`}
                          >
                            Rp {card.saldo.toLocaleString('id-ID')}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell className='text-center'>
                          <Badge
                            variant='outline'
                            className={`text-xs gap-1 ${statusCfg.className}`}
                          >
                            <StatusIcon className='h-3 w-3' />
                            {statusCfg.label}
                          </Badge>
                        </TableCell>

                        {/* Last Used */}
                        <TableCell className='text-center'>
                          <span className='text-xs text-muted-foreground'>
                            {card.last_used_at
                              ? new Date(card.last_used_at).toLocaleDateString('id-ID', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '—'}
                          </span>
                        </TableCell>

                        {/* Aksi */}
                        <TableCell className='text-center'>
                          <TooltipProvider delayDuration={150}>
                            <div className='flex items-center justify-center gap-1.5'>
                              {/* Top-up */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    variant='ghost'
                                    disabled={!isActive}
                                    onClick={() => openModal('topup', card)}
                                    className='h-8 w-8 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 disabled:opacity-30'
                                  >
                                    <Wallet className='h-4 w-4' />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Top-up Saldo</TooltipContent>
                              </Tooltip>

                              {/* Refund / Return */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    variant='ghost'
                                    disabled={!isActive}
                                    onClick={() => openModal('refund', card)}
                                    className='h-8 w-8 rounded-lg text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40 disabled:opacity-30'
                                  >
                                    <ArrowLeftRight className='h-4 w-4' />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Kembalikan Kartu & Refund</TooltipContent>
                              </Tooltip>

                              {/* Blokir */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    variant='ghost'
                                    disabled={isBlocked}
                                    onClick={() => openModal('blokir', card)}
                                    className='h-8 w-8 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40 disabled:opacity-30'
                                  >
                                    <ShieldAlert className='h-4 w-4' />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Blokir Kartu</TooltipContent>
                              </Tooltip>

                              {/* Riwayat (placeholder) */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    variant='ghost'
                                    className='h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    onClick={() => {
                                      // Placeholder: riwayat transaksi per kartu
                                    }}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Riwayat Transaksi</TooltipContent>
                              </Tooltip>
                            </div>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Legend */}
            <div className='flex flex-wrap items-center gap-4 px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30'>
              <p className='text-xs text-muted-foreground font-medium'>Keterangan status:</p>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon
                return (
                  <div key={key} className='flex items-center gap-1.5'>
                    <Badge variant='outline' className={`text-xs gap-1 ${cfg.className}`}>
                      <Icon className='h-3 w-3' />
                      {cfg.label}
                    </Badge>
                    {key === 'ACTIVE' && (
                      <span className='text-xs text-muted-foreground'>= Sedang dipinjam, dapat bertransaksi</span>
                    )}
                    {key === 'BLOCKED' && (
                      <span className='text-xs text-muted-foreground'>= Dilaporkan hilang, ditolak di kasir</span>
                    )}
                    {key === 'AVAILABLE' && (
                      <span className='text-xs text-muted-foreground'>= Dikembalikan, siap dipinjam ulang</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Main>

      {/* Modals */}
      <RegisterKartuModal
        open={activeModal === 'register'}
        onOpenChange={(o) => !o && closeModal()}
        existingCards={cards}
        onRegistered={handleRegistered}
        onShowSlip={showSlip}
      />
      <TopupKartuTamuModal
        open={activeModal === 'topup'}
        onOpenChange={(o) => !o && closeModal()}
        kartu={selectedCard}
        onTopupSuccess={handleTopupSuccess}
        onShowSlip={showSlip}
      />
      <RefundKartuModal
        open={activeModal === 'refund'}
        onOpenChange={(o) => !o && closeModal()}
        kartu={selectedCard}
        onRefundSuccess={handleRefundSuccess}
        onShowSlip={showSlip}
      />
      <BlokirKartuModal
        open={activeModal === 'blokir'}
        onOpenChange={(o) => !o && closeModal()}
        kartu={selectedCard}
        allCards={cards}
        onBlokirSuccess={handleBlokirSuccess}
      />
      <KartuTamuSlipModal
        open={isSlipOpen}
        onOpenChange={setIsSlipOpen}
        slipData={slipData}
      />
    </>
  )
}

// ─── Summary Card Sub-component ────────────────────────────────────────────

interface SummaryCardProps {
  label: string
  value: number | string
  icon: React.ElementType
  colorClass: string
  badgeClass: string
  isRupiah?: boolean
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  colorClass,
  badgeClass,
}: SummaryCardProps) {
  return (
    <div className='flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm'>
      <div className={`p-2.5 rounded-xl ${colorClass}`}>
        <Icon className='h-5 w-5' />
      </div>
      <div className='min-w-0'>
        <p className='text-xs text-muted-foreground font-medium truncate'>{label}</p>
        <p className={`text-lg font-bold leading-tight ${badgeClass}`}>
          {typeof value === 'number' ? value : value}
        </p>
      </div>
    </div>
  )
}
