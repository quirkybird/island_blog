import {Link} from 'react-router-dom'
import Tags from '../Tags'
import formDate from '../../utils/formatDate';
const IntroPost = ({post}) => {
  return ( 
    <section>
        <div className="post-intro-card px-5 pt-5">
          <div className="w-full">
          <img className='rounded-md' src={`https://server.yamorz.top/image/${post.image}`} alt={post.title} />
          </div>
          <div><Tags tags={JSON.parse(post.tags)} /></div>
          <h2  className='text-xl font-semibold'>{post.title}</h2>
          <div className='text-sm text-gray-500 font-light py-4'> 
            <span>作者: {post.author}</span>
            <span>  -{formDate(post.create_at)}</span>
          </div>
          <p className='text-base font-normal mb-4'>{post.descr}</p>
          <span className='text-blue-400'> 
            <Link to={`/blog/${post.id}`}>{">阅读全文"}</Link>
          </span>
        </div>
    </section>
   );
}
 
export default IntroPost;