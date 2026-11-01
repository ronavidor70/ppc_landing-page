import { MessageCircle } from "lucide-react";
import PostCard, { PostMeta } from "./PostCard.jsx";
import { relatedPosts } from "./posts.js";
import { waLink } from "../config.js";
import { useLang } from "../i18n.jsx";
import { Sparkle } from "../components/Decor.jsx";

export default function BlogPost({ post, body }) {
  const { t } = useLang();
  const related = relatedPosts(post);

  return (
    <>
      <article className="blog-article">
        <header className="blog-article__head">
          <div className="container blog-article__narrow">
            <nav className="blog-crumbs" aria-label="breadcrumb">
              <a href="/">דף הבית</a>
              <span aria-hidden="true">/</span>
              <a href="/blog">בלוג</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{post.category}</span>
            </nav>
            <span className="blog-chip">{post.category}</span>
            <h1 className="blog-article__title">{post.title}</h1>
            <p className="blog-article__lead">{post.description}</p>
            <PostMeta post={post} />
          </div>
        </header>

        <div className="container blog-article__narrow">
          <div className="blog-article__cover">
            <img src={post.cover} alt={post.coverAlt} width="1200" height="630" />
          </div>

          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: body }} />

          <aside className="blog-cta">
            <Sparkle className="blog-cta__spark" size={28} color="#161310" />
            <h2>רוצים שנבדוק את זה אצלכם?</h2>
            <p>נעבור על החשבון שלכם, ונראה איפה התקציב עובד ואיפה הוא נוזל. בלי התחייבות.</p>
            <div className="blog-cta__actions">
              <a href="#lead" className="btn btn-dark">
                {t.nav.cta}
              </a>
              <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                <MessageCircle size={19} />
                {t.nav.waBtn}
              </a>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="blog-related">
          <div className="container">
            <h2 className="blog-related__title">מאמרים נוספים</h2>
            <div className="blog-grid">
              {related.map((other) => (
                <PostCard key={other.slug} post={other} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
