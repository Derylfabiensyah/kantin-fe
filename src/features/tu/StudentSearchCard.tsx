import { useState } from 'react'
import type { KartuSiswaMock } from '@/mocks/mock-data'
import {
  Search,
  Radio,
  Check,
  ChevronsUpDown,
  User,
  CreditCard,
  AlertTriangle,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface StudentSearchCardProps {
  students: KartuSiswaMock[]
  selectedStudent: KartuSiswaMock | null
  onSelectStudent: (student: KartuSiswaMock | null) => void
  isLoading?: boolean
}

export function StudentSearchCard({
  students,
  selectedStudent,
  onSelectStudent,
  isLoading = false,
}: StudentSearchCardProps) {
  const [openCombobox, setOpenCombobox] = useState(false)
  const [rfidInput, setRfidInput] = useState('')
  const [rfidFeedback, setRfidFeedback] = useState<string | null>(null)

  const handleSimulateRfid = (uidToSimulate?: string) => {
    const targetUid = uidToSimulate || rfidInput.trim()
    if (!targetUid) return

    const found = students.find(
      (s) => s.uid.toLowerCase() === targetUid.toLowerCase()
    )
    if (found) {
      onSelectStudent(found)
      setRfidFeedback(`Kartu RFID terdeteksi: ${found.nama} (${found.nis})`)
      setRfidInput(found.uid)
    } else {
      setRfidFeedback(`RFID UID "${targetUid}" tidak terdaftar di sistem.`)
    }
  }

  return (
    <Card className='border-slate-200 shadow-sm dark:border-slate-800'>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
              <User className='h-5 w-5 text-primary' />
              Pencarian Data Siswa
            </CardTitle>
            <CardDescription>
              Cari berdasarkan NIS, Nama Siswa, atau Tap Kartu RFID reader TU
            </CardDescription>
          </div>
          <Badge
            variant='outline'
            className='flex items-center gap-1.5 border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
          >
            <Radio className='h-3.5 w-3.5 animate-pulse text-blue-600 dark:text-blue-400' />
            RFID Reader Aktif
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Autocomplete Input Search */}
        <div className='space-y-2'>
          <label className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
            Autokomplit NIS / Nama Siswa
          </label>
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={openCombobox}
                className='h-11 w-full justify-between text-left font-normal'
                disabled={isLoading}
              >
                {selectedStudent ? (
                  <span className='flex items-center gap-2 truncate font-medium text-slate-900 dark:text-slate-100'>
                    <span className='rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400'>
                      {selectedStudent.nis}
                    </span>
                    {selectedStudent.nama} ({selectedStudent.kelas})
                  </span>
                ) : (
                  <span className='flex items-center gap-2 text-muted-foreground'>
                    <Search className='h-4 w-4' />
                    Ketik NIS atau Nama Siswa...
                  </span>
                )}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-[var(--radix-popover-trigger-width)] p-0'
              align='start'
            >
              <Command>
                <CommandInput placeholder='Cari NIS atau nama...' />
                <CommandList>
                  <CommandEmpty>Siswa tidak ditemukan.</CommandEmpty>
                  <CommandGroup heading='Daftar Siswa'>
                    {students.map((student) => (
                      <CommandItem
                        key={student.siswa_id}
                        value={`${student.nis} ${student.nama} ${student.kelas}`}
                        onSelect={() => {
                          onSelectStudent(student)
                          setOpenCombobox(false)
                        }}
                        className='flex cursor-pointer items-center justify-between py-2.5'
                      >
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-8 w-8'>
                            <AvatarImage
                              src={student.foto_url}
                              alt={student.nama}
                            />
                            <AvatarFallback>
                              {student.nama.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='text-sm leading-none font-medium'>
                              {student.nama}
                            </p>
                            <p className='mt-0.5 text-xs text-muted-foreground'>
                              NIS: {student.nis} • {student.kelas}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='text-xs font-semibold text-emerald-600 dark:text-emerald-400'>
                            Rp {student.saldo.toLocaleString('id-ID')}
                          </span>
                          {selectedStudent?.siswa_id === student.siswa_id && (
                            <Check className='h-4 w-4 text-primary' />
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* RFID Tap Simulation Box */}
        <div className='space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50'>
          <div className='flex items-center justify-between'>
            <label className='flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300'>
              <CreditCard className='h-3.5 w-3.5 text-blue-600' />
              Simulasi Tap Kartu RFID (Reader TU)
            </label>
            <span className='text-[10px] text-muted-foreground'>
              Pilih kartu sampel:
            </span>
          </div>

          <div className='flex flex-wrap gap-1.5'>
            {students.map((student) => (
              <Button
                key={student.uid}
                type='button'
                variant='ghost'
                size='sm'
                className='h-7 border border-slate-200 bg-white text-xs hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-blue-950'
                onClick={() => handleSimulateRfid(student.uid)}
              >
                Tap RFID {student.nama.split(' ')[0]} ({student.uid})
              </Button>
            ))}
          </div>

          <div className='flex gap-2 pt-1'>
            <Input
              placeholder='Atau ketik UID Kartu (contoh: 04A1B2C3D4)...'
              value={rfidInput}
              onChange={(e) => setRfidInput(e.target.value)}
              className='h-9 bg-white font-mono text-xs dark:bg-slate-950'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSimulateRfid()
                }
              }}
            />
            <Button
              type='button'
              size='sm'
              variant='secondary'
              className='h-9 px-3 text-xs'
              onClick={() => handleSimulateRfid()}
            >
              Simulasi Tap
            </Button>
          </div>

          {rfidFeedback && (
            <p className='pt-1 text-xs font-medium text-blue-600 dark:text-blue-400'>
              {rfidFeedback}
            </p>
          )}
        </div>

        {/* Selected Student Detail View */}
        {selectedStudent ? (
          <div className='space-y-4 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900'>
            <div className='flex items-start gap-4'>
              <Avatar className='h-16 w-16 border-2 border-white shadow-md dark:border-slate-800'>
                <AvatarImage
                  src={selectedStudent.foto_url}
                  alt={selectedStudent.nama}
                />
                <AvatarFallback className='bg-primary/10 text-lg font-bold text-primary'>
                  {selectedStudent.nama.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className='min-w-0 flex-1'>
                <div className='flex items-center justify-between gap-2'>
                  <h3 className='truncate text-base font-bold text-slate-900 dark:text-slate-100'>
                    {selectedStudent.nama}
                  </h3>
                  {selectedStudent.is_blocked ? (
                    <Badge
                      variant='destructive'
                      className='flex shrink-0 items-center gap-1'
                    >
                      <AlertTriangle className='h-3 w-3' />
                      Kartu Diblokir
                    </Badge>
                  ) : (
                    <Badge
                      variant='default'
                      className='shrink-0 bg-emerald-600 hover:bg-emerald-700'
                    >
                      Status: Aktif
                    </Badge>
                  )}
                </div>

                <div className='mt-2 grid grid-cols-2 gap-2 text-xs'>
                  <div>
                    <span className='text-muted-foreground'>NIS:</span>{' '}
                    <span className='font-mono font-semibold text-slate-700 dark:text-slate-300'>
                      {selectedStudent.nis}
                    </span>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Kelas:</span>{' '}
                    <span className='font-medium text-slate-700 dark:text-slate-300'>
                      {selectedStudent.kelas}
                    </span>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>UID RFID:</span>{' '}
                    <span className='font-mono text-slate-600 dark:text-slate-400'>
                      {selectedStudent.uid}
                    </span>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Limit Harian:</span>{' '}
                    <span className='font-medium text-slate-700 dark:text-slate-300'>
                      Rp {selectedStudent.limit_harian.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950'>
              <span className='text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-400'>
                Saldo Saat Ini
              </span>
              <span className='font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400'>
                Rp {selectedStudent.saldo.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        ) : (
          <div className='rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/30'>
            <User className='mx-auto mb-2 h-10 w-10 text-muted-foreground opacity-40' />
            <p className='text-sm font-medium text-muted-foreground'>
              Belum ada siswa terpilih
            </p>
            <p className='mt-1 text-xs text-muted-foreground/70'>
              Gunakan autokomplit NIS/Nama di atas atau simulasikan Tap Kartu
              RFID
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
