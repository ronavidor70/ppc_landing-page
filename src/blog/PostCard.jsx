import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { formatDate, postPath } from "./posts.js";

export function PostMeta({ post }) {
  return (
    <p className="blog-meta">
      <span>
        <CalendarDays size={15} aria-hidden="true" />
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </span>
      <span>
        <Clock size={15} aria-hidden="true" />
        {post.readingMinutes} דקות קריאה
      </span>
    </p>
  );
}

/* כרטיס מאמר. featured הוא הכרטיס הרחב בראש הרשימה. */
export default function PostCard({ post, featured = false }) {
  return (
    <article className={`blog-card ${featured ? "blog-card--featured" : ""}`}>
      <a href={postPath(post)} className="blog-card__link">
        <div className="blog-card__media">
          <img
            src={post.cover}
            alt={post.coverAlt}
            width="1200"
            height="630"
            loading={featured ? "eager" : "lazy"}
          />
        </div>
        <div className="blog-card__body">
          <span className="blog-chip">{post.category}</span>
          {featured ? <h2 className="blog-card__title">{post.title}</h2> : <h3 className="blog-card__title">{post.title}</h3>}
          <p className="blog-card__desc">{post.description}</p>
          <PostMeta post={post} />
          <span className="blog-card__more">
            למאמר המלא
            <ArrowLeft size={17} aria-hidden="true" />
          </span>
        </div>
      </a>
    </article>
  );
}
