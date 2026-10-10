import Link from "next/link";

const changes = [
  ["Кадр", "лёгкий зум и смещение обрезки — субтитры и логотипы остаются читаемыми"],
  ["Цвет", "яркость, контраст, насыщенность, гамма, мелкое зерно и виньетка"],
  ["Скорость", "ускорение на 1–5% — видео и звук синхронно"],
  ["Звук", "чуть выше тон и громкость"],
  ["Файл", "новый код, 30 fps, стёртые метаданные, новая дата создания"],
];

const steps = [
  ["Войдите по почте", "Без пароля — пришлём ссылку для входа."],
  ["Загрузите ролик", "MP4, MOV, WEBM или MKV до 500 МБ и 11 минут."],
  ["Скачайте версию", "Через минуту-две готово. Каждая версия — со своими случайными параметрами."],
];

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="space-y-5 pt-4">
        <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
          Один ролик — <span className="text-accent">много уникальных версий</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          Для Reels, Shorts и TikTok. Новая версия не совпадает с исходником ни по файлу, ни по метаданным, но выглядит и
          звучит так же.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-xl bg-accent px-6 py-3 font-semibold text-accent-fg shadow-sm hover:opacity-90"
        >
          Попробовать — 3 ролика бесплатно
        </Link>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Что меняется</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {changes.map(([t, d]) => (
            <li key={t} className="rounded-xl border border-border bg-card p-4">
              <div className="font-medium">{t}</div>
              <div className="text-sm text-muted">{d}</div>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">Кадр никогда не зеркалится — текст в кадре не станет задом наперёд.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Три шага</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-fg">
                {i + 1}
              </div>
              <div className="font-medium">{t}</div>
              <div className="text-sm text-muted">{d}</div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
