import uuid
import json
from datetime import datetime, timedelta
import random

def gen_sql():
    with open('seed_data.sql', 'w', encoding='utf-8') as f:
        # Generate some reusable user IDs
        user_ids = [str(uuid.uuid4()) for _ in range(20)]
        post_ids = []
        
        f.write("-- Bảng posts\n")
        for i in range(100):
            p_id = str(uuid.uuid4())
            post_ids.append(p_id)
            u_id = random.choice(user_ids)
            p_type = random.randint(0, 2)
            content = json.dumps({"text": f"This is sample content number {i}", "url": f"http://example.com/media/{i}.jpg"})
            f.write(f"INSERT INTO posts (id, account_id, type, caption, content, view_count, like_count, comment_count, is_public, created_at, updated_at, is_deleted) VALUES ('{p_id}', '{u_id}', {p_type}, 'Bài viết mẫu số {i}', '{content}'::jsonb, {random.randint(0, 1000)}, {random.randint(0, 100)}, {random.randint(0, 50)}, true, current_timestamp - interval '{random.randint(1, 30)} days', current_timestamp, false);\n")
            
        f.write("\n-- Bảng likes\n")
        for p_id in post_ids:
            num_likes = random.randint(0, 5)
            likers = random.sample(user_ids, min(num_likes, len(user_ids)))
            for u_id in likers:
                f.write(f"INSERT INTO likes (post_id, account_id, created_at) VALUES ('{p_id}', '{u_id}', current_timestamp - interval '{random.randint(1, 10)} days');\n")
                
        f.write("\n-- Bảng comments\n")
        for p_id in post_ids:
            num_comments = random.randint(0, 3)
            for j in range(num_comments):
                c_id = str(uuid.uuid4())
                u_id = random.choice(user_ids)
                f.write(f"INSERT INTO comments (id, post_id, account_id, content, username, user_avatar, user_is_artist, is_deleted, created_at, updated_at) VALUES ('{c_id}', '{p_id}', '{u_id}', 'Bình luận cực hay {j} cho bài viết', 'User_{u_id[:5]}', 'https://avatar.com/user{j}.png', false, false, current_timestamp - interval '{random.randint(1, 5)} days', current_timestamp);\n")

if __name__ == '__main__':
    gen_sql()
    print("Generated seed_data.sql")
