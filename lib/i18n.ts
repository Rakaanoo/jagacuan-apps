'use client'

import { useAppStore } from '@/lib/store'

// ===== Translation Dictionaries =====

const id: Record<string, string> = {
  // === Page / Home ===
  'page.title': 'Jagacuan',
  'page.calendar': 'Kalender',
  'page.statistics': 'Statistik',
  'page.rooms': 'Ruang',
  'page.search_placeholder': 'Cari target celengan...',
  'page.sort_newest': 'Terbaru',
  'page.sort_progress': 'Progres Tertinggi',
  'page.sort_deadline': 'Deadline Terdekat',
  'page.finished_count': '{{count}} Target Berhasil Diselesaikan',
  'page.no_active': 'Belum ada target aktif',
  'page.no_active_hint': 'Tekan <b>+</b> untuk mulai membuat target tabunganmu.',
  'page.no_finished': 'Belum ada target yang selesai.',
  'page.tab_active': 'Berjalan',
  'page.tab_finished': 'Selesai',

  // === Sidebar / Menu ===
  'sidebar.menu': 'Menu',
  'sidebar.archive': 'Arsip Target',
  'sidebar.archive_desc': 'Daftar celengan yang telah selesai/diarsip',
  'sidebar.language': 'Bahasa',
  'sidebar.language_desc': 'Pengaturan Bahasa ({{lang}})',
  'sidebar.currency': 'Mata Uang',
  'sidebar.currency_desc': 'Pilihan Mata Uang (IDR - Rp)',
  'sidebar.theme': 'Tema: {{mode}}',
  'sidebar.theme_dark': 'Dark Mode',
  'sidebar.theme_cream': 'Cream Mode',
  'sidebar.theme_desc': 'Klik untuk beralih mode tampilan aplikasi',
  'sidebar.backup': 'Backup & Restore',
  'sidebar.backup_desc': 'Simpan / Pulihkan data catat tabungan',
  'sidebar.info': 'Info Aplikasi',
  'sidebar.info_desc': 'Jagacuan v1.0.0 - Pencatat Tabungan Impian',
  'sidebar.rating': 'Beri Rating',
  'sidebar.rating_desc': 'Dukung pengembangan aplikasi ini',

  // === Select Target Type ===
  'select_type.title': 'Pilih Jenis Target',
  'select_type.subtitle': 'Mau menabung seperti apa?',
  'select_type.nabung': 'Tabungan Target',
  'select_type.nabung_desc': 'Menabung sendiri sampai target tercapai',
  'select_type.berkala': 'Tabungan Berkala',
  'select_type.berkala_desc': 'Menabung secara rutin (harian/mingguan/bulanan)',
  'select_type.nabar': 'Nabung Bareng',
  'select_type.nabar_desc': 'Menabung bersama teman atau keluarga',

  // === Create Target Modal ===
  'create.title_nabung': 'Target Tabungan Baru',
  'create.title_berkala': 'Tabungan Berkala Baru',
  'create.name_label': 'Nama Target',
  'create.name_placeholder': 'Contoh: Beli PS5, Liburan Bali...',
  'create.amount_label': 'Jumlah Target (Rp)',
  'create.amount_placeholder': '0',
  'create.start_date': 'Tanggal Mulai',
  'create.deadline_label': 'Target Tanggal Selesai',
  'create.deadline_tetap': 'Tetap',
  'create.deadline_fleksibel': 'Fleksibel',
  'create.note_label': 'Catatan (opsional)',
  'create.note_placeholder': 'Tulis motivasi atau catatan...',
  'create.cover_label': 'Gambar Cover (opsional)',
  'create.cover_click': 'Klik untuk upload gambar',
  'create.button_save': 'Simpan Target',
  'create.berkala_frequency': 'Frekuensi Menabung',
  'create.berkala_daily': 'Harian',
  'create.berkala_weekly': 'Mingguan',
  'create.berkala_monthly': 'Bulanan',
  'create.berkala_amount': 'Jumlah Per Periode',

  // === Target Detail Modal ===
  'detail.progress': 'Progres',
  'detail.target': 'Target',
  'detail.remaining': 'Sisa',
  'detail.deadline': 'Deadline',
  'detail.deadline_flexible': 'Fleksibel',
  'detail.days_remaining': '{{days}} hari lagi',
  'detail.expired': 'Sudah lewat',
  'detail.note': 'Catatan',
  'detail.deposit': 'Setor',
  'detail.withdraw': 'Tarik',
  'detail.transaction_history': 'Riwayat Transaksi',
  'detail.no_transactions': 'Belum ada transaksi',
  'detail.deposit_label': 'Setoran',
  'detail.withdraw_label': 'Penarikan',
  'detail.edit': 'Edit',
  'detail.delete': 'Hapus',
  'detail.delete_confirm': 'Hapus target ini?',
  'detail.delete_confirm_desc': 'Target dan semua riwayat transaksi akan dihapus permanen.',
  'detail.delete_yes': 'Ya, Hapus',
  'detail.delete_cancel': 'Batal',
  'detail.alarm_title': 'Pengingat',
  'detail.alarm_set': 'Atur Pengingat',
  'detail.alarm_active': 'Pengingat Aktif',
  'detail.alarm_days_label': 'Hari Pengingat',
  'detail.alarm_time_label': 'Waktu',
  'detail.alarm_save': 'Simpan Pengingat',
  'detail.alarm_cancel': 'Batal',
  'detail.alarm_delete': 'Hapus Pengingat',
  'detail.day_mon': 'Sen',
  'detail.day_tue': 'Sel',
  'detail.day_wed': 'Rab',
  'detail.day_thu': 'Kam',
  'detail.day_fri': 'Jum',
  'detail.day_sat': 'Sab',
  'detail.day_sun': 'Min',

  // === Catat Tabungan Modal ===
  'catat.title_setor': 'Setor Tabungan',
  'catat.title_tarik': 'Tarik Tabungan',
  'catat.amount_label': 'Jumlah (Rp)',
  'catat.amount_placeholder': '0',
  'catat.note_label': 'Keterangan (opsional)',
  'catat.note_placeholder': 'Tulis catatan singkat...',
  'catat.button_setor': 'Simpan Setoran',
  'catat.button_tarik': 'Simpan Penarikan',

  // === Edit Target Modal ===
  'edit.title': 'Edit Target',
  'edit.save': 'Simpan Perubahan',

  // === Calendar Modal ===
  'calendar.title': 'Kalender Tabungan',
  'calendar.today': 'Hari ini',
  'calendar.no_activity': 'Tidak ada aktivitas',
  'calendar.deposit': 'Setoran',
  'calendar.withdraw': 'Penarikan',
  'calendar.total': 'Total',
  'calendar.month_jan': 'Januari',
  'calendar.month_feb': 'Februari',
  'calendar.month_mar': 'Maret',
  'calendar.month_apr': 'April',
  'calendar.month_may': 'Mei',
  'calendar.month_jun': 'Juni',
  'calendar.month_jul': 'Juli',
  'calendar.month_aug': 'Agustus',
  'calendar.month_sep': 'September',
  'calendar.month_oct': 'Oktober',
  'calendar.month_nov': 'November',
  'calendar.month_dec': 'Desember',
  'calendar.day_sun': 'Min',
  'calendar.day_mon': 'Sen',
  'calendar.day_tue': 'Sel',
  'calendar.day_wed': 'Rab',
  'calendar.day_thu': 'Kam',
  'calendar.day_fri': 'Jum',
  'calendar.day_sat': 'Sab',

  // === Statistics Modal ===
  'stats.title': 'Statistik Tabungan',
  'stats.total_saved': 'Total Ditabung',
  'stats.total_target': 'Total Target',
  'stats.active_targets': 'Target Aktif',
  'stats.finished_targets': 'Target Selesai',
  'stats.avg_progress': 'Rata-rata Progres',
  'stats.total_transactions': 'Total Transaksi',
  'stats.total_deposits': 'Total Setoran',
  'stats.total_withdrawals': 'Total Penarikan',

  // === Backup & Restore Modal ===
  'backup.title': 'Backup & Restore',
  'backup.export_title': 'Backup Data',
  'backup.export_desc': 'Simpan semua data tabungan ke file JSON',
  'backup.export_button': 'Download Backup',
  'backup.import_title': 'Restore Data',
  'backup.import_desc': 'Pulihkan data dari file backup JSON',
  'backup.import_button': 'Upload File Backup',
  'backup.warning': 'Data saat ini akan ditimpa dengan data dari file backup.',

  // === Nabar Room Modal ===
  'nabar.title': 'Nabung Bareng',
  'nabar.create_room': 'Buat Room Baru',
  'nabar.room_name': 'Nama Room',
  'nabar.room_name_placeholder': 'Contoh: Liburan Bersama...',
  'nabar.target_amount': 'Target Dana (Rp)',
  'nabar.create_button': 'Buat Room',
  'nabar.members': 'Anggota',
  'nabar.pending': 'Menunggu Persetujuan',
  'nabar.approve': 'Setujui',
  'nabar.reject': 'Tolak',
  'nabar.activities': 'Aktivitas Terbaru',
  'nabar.join': 'Gabung Room',
  'nabar.no_rooms': 'Belum ada room nabung bareng',
  'nabar.deposit': 'Setor',
  'nabar.withdraw': 'Tarik',

  // === Create Nabar Modal ===
  'create_nabar.title': 'Buat Room Nabung Bareng',
  'create_nabar.room_name': 'Nama Room',
  'create_nabar.room_name_placeholder': 'Contoh: Liburan Bali Bareng...',
  'create_nabar.target_amount': 'Target Dana (Rp)',
  'create_nabar.deadline': 'Target Tanggal',
  'create_nabar.note': 'Catatan (opsional)',
  'create_nabar.note_placeholder': 'Catatan atau deskripsi room...',
  'create_nabar.cover': 'Gambar Cover (opsional)',
  'create_nabar.cover_click': 'Klik untuk upload gambar',
  'create_nabar.save': 'Buat Room',

  // === Toast Messages ===
  'toast.target_created': 'Target Baru Berhasil Dibuat!',
  'toast.target_updated': 'Target Berhasil Diperbarui!',
  'toast.target_deleted': 'Target Telah Dihapus',
  'toast.target_achieved': 'SELAMAT! Target Tercapai!',
  'toast.target_achieved_sub': '{{title}} berhasil dituntaskan!',
  'toast.deposit_success': 'Setoran Berhasil Dicatat!',
  'toast.deposit_sub': 'Ditambah {{amount}}',
  'toast.withdraw_success': 'Catatan Penarikan Disimpan',
  'toast.withdraw_sub': 'Kurangi {{amount}}',
  'toast.undo_success': 'Transaksi Berhasil Diundo!',
  'toast.nabar_created': 'Room Nabung Bareng Dibuat!',
  'toast.nabar_activity': 'Aktivitas Nabar Dicatat!',
  'toast.nabar_activity_sub': '{{name}}: {{amount}}',
  'toast.join_sent': 'Permintaan Join Dikirim',
  'toast.join_sent_sub': 'Menunggu persetujuan owner room',
  'toast.member_approved': 'Anggota Disetujui!',
  'toast.member_approved_sub': '{{name}} telah bergabung di room',
  'toast.member_rejected': 'Permintaan Ditolak',
  'toast.member_rejected_sub': '{{name}} ditolak',
  'toast.data_restored': 'Data Berhasil Dipulihkan!',
  'toast.theme_changed': 'Tema Diubah ke {{theme}}',

  // === Language Names ===
  'lang.id': 'Bahasa Indonesia',
  'lang.en': 'English',
}

const en: Record<string, string> = {
  // === Page / Home ===
  'page.title': 'Jagacuan',
  'page.calendar': 'Calendar',
  'page.statistics': 'Statistics',
  'page.rooms': 'Rooms',
  'page.search_placeholder': 'Search savings target...',
  'page.sort_newest': 'Newest',
  'page.sort_progress': 'Highest Progress',
  'page.sort_deadline': 'Nearest Deadline',
  'page.finished_count': '{{count}} Targets Completed',
  'page.no_active': 'No active targets yet',
  'page.no_active_hint': 'Press <b>+</b> to start creating your savings target.',
  'page.no_finished': 'No completed targets yet.',
  'page.tab_active': 'Active',
  'page.tab_finished': 'Finished',

  // === Sidebar / Menu ===
  'sidebar.menu': 'Menu',
  'sidebar.archive': 'Target Archive',
  'sidebar.archive_desc': 'List of completed/archived savings',
  'sidebar.language': 'Language',
  'sidebar.language_desc': 'Language Setting ({{lang}})',
  'sidebar.currency': 'Currency',
  'sidebar.currency_desc': 'Currency Option (IDR - Rp)',
  'sidebar.theme': 'Theme: {{mode}}',
  'sidebar.theme_dark': 'Dark Mode',
  'sidebar.theme_cream': 'Cream Mode',
  'sidebar.theme_desc': 'Click to switch display mode',
  'sidebar.backup': 'Backup & Restore',
  'sidebar.backup_desc': 'Save / Restore savings data',
  'sidebar.info': 'App Info',
  'sidebar.info_desc': 'Jagacuan v1.0.0 - Dream Savings Tracker',
  'sidebar.rating': 'Rate App',
  'sidebar.rating_desc': 'Support the development of this app',

  // === Select Target Type ===
  'select_type.title': 'Choose Target Type',
  'select_type.subtitle': 'How would you like to save?',
  'select_type.nabung': 'Savings Target',
  'select_type.nabung_desc': 'Save on your own until the goal is reached',
  'select_type.berkala': 'Periodic Savings',
  'select_type.berkala_desc': 'Save regularly (daily/weekly/monthly)',
  'select_type.nabar': 'Group Savings',
  'select_type.nabar_desc': 'Save together with friends or family',

  // === Create Target Modal ===
  'create.title_nabung': 'New Savings Target',
  'create.title_berkala': 'New Periodic Savings',
  'create.name_label': 'Target Name',
  'create.name_placeholder': 'E.g.: Buy PS5, Bali Trip...',
  'create.amount_label': 'Target Amount (Rp)',
  'create.amount_placeholder': '0',
  'create.start_date': 'Start Date',
  'create.deadline_label': 'Target Completion Date',
  'create.deadline_tetap': 'Fixed',
  'create.deadline_fleksibel': 'Flexible',
  'create.note_label': 'Note (optional)',
  'create.note_placeholder': 'Write motivation or notes...',
  'create.cover_label': 'Cover Image (optional)',
  'create.cover_click': 'Click to upload image',
  'create.button_save': 'Save Target',
  'create.berkala_frequency': 'Saving Frequency',
  'create.berkala_daily': 'Daily',
  'create.berkala_weekly': 'Weekly',
  'create.berkala_monthly': 'Monthly',
  'create.berkala_amount': 'Amount Per Period',

  // === Target Detail Modal ===
  'detail.progress': 'Progress',
  'detail.target': 'Target',
  'detail.remaining': 'Remaining',
  'detail.deadline': 'Deadline',
  'detail.deadline_flexible': 'Flexible',
  'detail.days_remaining': '{{days}} days left',
  'detail.expired': 'Expired',
  'detail.note': 'Note',
  'detail.deposit': 'Deposit',
  'detail.withdraw': 'Withdraw',
  'detail.transaction_history': 'Transaction History',
  'detail.no_transactions': 'No transactions yet',
  'detail.deposit_label': 'Deposit',
  'detail.withdraw_label': 'Withdrawal',
  'detail.edit': 'Edit',
  'detail.delete': 'Delete',
  'detail.delete_confirm': 'Delete this target?',
  'detail.delete_confirm_desc': 'Target and all transaction history will be permanently deleted.',
  'detail.delete_yes': 'Yes, Delete',
  'detail.delete_cancel': 'Cancel',
  'detail.alarm_title': 'Reminder',
  'detail.alarm_set': 'Set Reminder',
  'detail.alarm_active': 'Reminder Active',
  'detail.alarm_days_label': 'Reminder Days',
  'detail.alarm_time_label': 'Time',
  'detail.alarm_save': 'Save Reminder',
  'detail.alarm_cancel': 'Cancel',
  'detail.alarm_delete': 'Delete Reminder',
  'detail.day_mon': 'Mon',
  'detail.day_tue': 'Tue',
  'detail.day_wed': 'Wed',
  'detail.day_thu': 'Thu',
  'detail.day_fri': 'Fri',
  'detail.day_sat': 'Sat',
  'detail.day_sun': 'Sun',

  // === Catat Tabungan Modal ===
  'catat.title_setor': 'Deposit Savings',
  'catat.title_tarik': 'Withdraw Savings',
  'catat.amount_label': 'Amount (Rp)',
  'catat.amount_placeholder': '0',
  'catat.note_label': 'Description (optional)',
  'catat.note_placeholder': 'Write a short note...',
  'catat.button_setor': 'Save Deposit',
  'catat.button_tarik': 'Save Withdrawal',

  // === Edit Target Modal ===
  'edit.title': 'Edit Target',
  'edit.save': 'Save Changes',

  // === Calendar Modal ===
  'calendar.title': 'Savings Calendar',
  'calendar.today': 'Today',
  'calendar.no_activity': 'No activity',
  'calendar.deposit': 'Deposit',
  'calendar.withdraw': 'Withdrawal',
  'calendar.total': 'Total',
  'calendar.month_jan': 'January',
  'calendar.month_feb': 'February',
  'calendar.month_mar': 'March',
  'calendar.month_apr': 'April',
  'calendar.month_may': 'May',
  'calendar.month_jun': 'June',
  'calendar.month_jul': 'July',
  'calendar.month_aug': 'August',
  'calendar.month_sep': 'September',
  'calendar.month_oct': 'October',
  'calendar.month_nov': 'November',
  'calendar.month_dec': 'December',
  'calendar.day_sun': 'Sun',
  'calendar.day_mon': 'Mon',
  'calendar.day_tue': 'Tue',
  'calendar.day_wed': 'Wed',
  'calendar.day_thu': 'Thu',
  'calendar.day_fri': 'Fri',
  'calendar.day_sat': 'Sat',

  // === Statistics Modal ===
  'stats.title': 'Savings Statistics',
  'stats.total_saved': 'Total Saved',
  'stats.total_target': 'Total Target',
  'stats.active_targets': 'Active Targets',
  'stats.finished_targets': 'Finished Targets',
  'stats.avg_progress': 'Average Progress',
  'stats.total_transactions': 'Total Transactions',
  'stats.total_deposits': 'Total Deposits',
  'stats.total_withdrawals': 'Total Withdrawals',

  // === Backup & Restore Modal ===
  'backup.title': 'Backup & Restore',
  'backup.export_title': 'Backup Data',
  'backup.export_desc': 'Save all savings data to a JSON file',
  'backup.export_button': 'Download Backup',
  'backup.import_title': 'Restore Data',
  'backup.import_desc': 'Restore data from a JSON backup file',
  'backup.import_button': 'Upload Backup File',
  'backup.warning': 'Current data will be overwritten with backup file data.',

  // === Nabar Room Modal ===
  'nabar.title': 'Group Savings',
  'nabar.create_room': 'Create New Room',
  'nabar.room_name': 'Room Name',
  'nabar.room_name_placeholder': 'E.g.: Trip Together...',
  'nabar.target_amount': 'Target Fund (Rp)',
  'nabar.create_button': 'Create Room',
  'nabar.members': 'Members',
  'nabar.pending': 'Pending Approval',
  'nabar.approve': 'Approve',
  'nabar.reject': 'Reject',
  'nabar.activities': 'Recent Activity',
  'nabar.join': 'Join Room',
  'nabar.no_rooms': 'No group savings rooms yet',
  'nabar.deposit': 'Deposit',
  'nabar.withdraw': 'Withdraw',

  // === Create Nabar Modal ===
  'create_nabar.title': 'Create Group Savings Room',
  'create_nabar.room_name': 'Room Name',
  'create_nabar.room_name_placeholder': 'E.g.: Bali Trip Together...',
  'create_nabar.target_amount': 'Target Fund (Rp)',
  'create_nabar.deadline': 'Target Date',
  'create_nabar.note': 'Note (optional)',
  'create_nabar.note_placeholder': 'Room description or notes...',
  'create_nabar.cover': 'Cover Image (optional)',
  'create_nabar.cover_click': 'Click to upload image',
  'create_nabar.save': 'Create Room',

  // === Toast Messages ===
  'toast.target_created': 'New Target Created!',
  'toast.target_updated': 'Target Updated!',
  'toast.target_deleted': 'Target Deleted',
  'toast.target_achieved': 'CONGRATULATIONS! Target Achieved!',
  'toast.target_achieved_sub': '{{title}} has been completed!',
  'toast.deposit_success': 'Deposit Recorded!',
  'toast.deposit_sub': 'Added {{amount}}',
  'toast.withdraw_success': 'Withdrawal Recorded',
  'toast.withdraw_sub': 'Deducted {{amount}}',
  'toast.undo_success': 'Transaction Undone!',
  'toast.nabar_created': 'Group Savings Room Created!',
  'toast.nabar_activity': 'Group Activity Recorded!',
  'toast.nabar_activity_sub': '{{name}}: {{amount}}',
  'toast.join_sent': 'Join Request Sent',
  'toast.join_sent_sub': 'Waiting for room owner approval',
  'toast.member_approved': 'Member Approved!',
  'toast.member_approved_sub': '{{name}} has joined the room',
  'toast.member_rejected': 'Request Rejected',
  'toast.member_rejected_sub': '{{name}} rejected',
  'toast.data_restored': 'Data Restored!',
  'toast.theme_changed': 'Theme Changed to {{theme}}',

  // === Language Names ===
  'lang.id': 'Bahasa Indonesia',
  'lang.en': 'English',
}

const dictionaries: Record<string, Record<string, string>> = { id, en }

// ===== Translation Function =====

type TranslateVars = Record<string, string | number>

function translate(lang: 'id' | 'en', key: string, vars?: TranslateVars): string {
  const dict = dictionaries[lang] || dictionaries['id']
  let text = dict[key] || dictionaries['id'][key] || key

  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v))
    })
  }

  return text
}

// ===== React Hook =====

export function useTranslation() {
  const language = useAppStore((s) => s.language)

  const t = (key: string, vars?: TranslateVars): string => {
    return translate(language, key, vars)
  }

  return { t, language }
}

// ===== Non-hook translate for store actions =====
export function getTranslator(lang: 'id' | 'en') {
  return (key: string, vars?: TranslateVars): string => {
    return translate(lang, key, vars)
  }
}
