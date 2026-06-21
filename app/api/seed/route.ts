import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

/**
 * POST /api/seed — 插入真实作品数据
 */
export async function POST() {
  const supabase = createAdminClient();

  // 1. 查找或创建测试用户
  const testEmail = 'demo@3dspace.dev';
  let userId: string;

  const { data: existingUser } = await supabase.auth.admin.listUsers();
  const found = existingUser?.users?.find((u: { email?: string }) => u.email === testEmail);

  if (found) {
    userId = found.id;
  } else {
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'demo123456',
      email_confirm: true,
      user_metadata: { username: 'demouser', display_name: '演示用户' },
    });
    if (createErr || !newUser.user) {
      return NextResponse.json({ error: `创建用户失败: ${createErr?.message}` }, { status: 500 });
    }
    userId = newUser.user.id;
    await new Promise((r) => setTimeout(r, 1000));
  }

  // 确保 profile 存在
  const { data: existingProfile } = await supabase.from('profiles').select('id').eq('id', userId).single();
  if (!existingProfile) {
    await supabase.from('profiles').insert({ id: userId, username: 'demouser', display_name: '演示用户', bio: '3D Space 官方演示账号' });
  }

  // 2. 清空旧数据
  await supabase.from('works').delete().eq('user_id', userId);

  // 3. 真实作品数据
  const testWorks = [
    // ===== 民宿 (is_featured=true 的进 Hero 轮播) =====
    {
      user_id: userId, title: '宁喻民宿', category: 'homestay', is_featured: true, is_published: true,
      description: '静谧雅致的独立庭院民宿，融合现代设计与自然光影，3D 高斯泼溅全场景还原。',
      cover_url: '/images/homestay/宁喻民宿/DSC00048.jpg',
      splat_file_url: 'https://superspl.at/s?id=6f01f0f4',
      splat_original_url: '/splats/gs2.sog',
      tags: ['民宿', '庭院', '自然光', '3D高斯泼溅'],
      photos: [
        '/images/homestay/宁喻民宿/DSC00048.jpg',
        '/images/homestay/宁喻民宿/DSC00052.jpg',
        '/images/homestay/宁喻民宿/DSC00055.jpg',
        '/images/homestay/宁喻民宿/DSC00057.jpg',
      ],
    },
    {
      user_id: userId, title: '宁喻民宿·房间', category: 'homestay', is_featured: false, is_published: true,
      description: '温馨舒适的房间，柔和灯光与木质元素营造家的感觉。',
      cover_url: '/images/homestay/宁喻民宿房间/DSC00075.jpg',
      tags: ['民宿', '房间', '温馨'],
      photos: [
        '/images/homestay/宁喻民宿房间/DSC00075.jpg',
        '/images/homestay/宁喻民宿房间/DSC00083.jpg',
        '/images/homestay/宁喻民宿房间/DSC00087.jpg',
      ],
    },
    {
      user_id: userId, title: '南夏民宿', category: 'homestay', is_featured: true, is_published: true,
      description: '阳光充沛的度假民宿，白墙与原木的极简美学。',
      cover_url: '/images/homestay/南夏民宿/DSC07614.jpg',
      tags: ['民宿', '极简', '度假'],
      photos: [
        '/images/homestay/南夏民宿/DSC07614.jpg',
        '/images/homestay/南夏民宿/DSC07617.jpg',
        '/images/homestay/南夏民宿/DSC07621(1).jpg',
        '/images/homestay/南夏民宿/DSC07622.jpg',
      ],
    },
    {
      user_id: userId, title: '孝陵卫民宿', category: 'homestay', is_featured: true, is_published: true,
      description: '南京孝陵卫旁的历史文化民宿，传统与现代交融的空间体验。',
      cover_url: '/images/homestay/孝陵卫民宿/DSC00178.jpg',
      tags: ['民宿', '历史', '南京', '文化'],
      photos: [
        '/images/homestay/孝陵卫民宿/DSC00178.jpg',
        '/images/homestay/孝陵卫民宿/DSC00186.jpg',
        '/images/homestay/孝陵卫民宿/DSC00197.jpg',
        '/images/homestay/孝陵卫民宿/DSC00200.jpg',
      ],
    },
    {
      user_id: userId, title: '中山风景区民宿', category: 'homestay', is_featured: true, is_published: true,
      description: '坐落于中山风景区旁的静谧民宿，远离城市喧嚣。',
      cover_url: '/images/homestay/孝陵卫民宿1/DSC07985.jpg',
      tags: ['民宿', '中山', '自然', '静谧'],
      photos: [
        '/images/homestay/孝陵卫民宿1/DSC07985.jpg',
        '/images/homestay/孝陵卫民宿1/DSC07989.jpg',
        '/images/homestay/孝陵卫民宿1/DSC07994.jpg',
        '/images/homestay/孝陵卫民宿1/DSC07999.jpg',
        '/images/homestay/孝陵卫民宿1/DSC08006.jpg',
      ],
    },

    // ===== 商业空间 =====
    {
      user_id: userId, title: '东森自然美', category: 'commercial', is_featured: true, is_published: true,
      description: '高端美容SPA空间，纯净白色调和自然光晕营造放松氛围。',
      cover_url: '/images/commercial/东森自然美/DSC00296.jpg',
      tags: ['商业', '美容', 'SPA', '白调'],
      photos: [
        '/images/commercial/东森自然美/DSC00296.jpg',
        '/images/commercial/东森自然美/DSC00297.jpg',
        '/images/commercial/东森自然美/DSC00302.jpg',
        '/images/commercial/东森自然美/DSC00310.jpg',
      ],
    },
    {
      user_id: userId, title: '心觅瑜伽馆', category: 'commercial', is_featured: false, is_published: true,
      description: '大窗采光的瑜伽空间，木地板与素白墙面，静谧平和。',
      cover_url: '/images/commercial/心觅瑜伽馆/DSC00362.jpg',
      tags: ['商业', '瑜伽', '静谧', '自然光'],
      photos: [
        '/images/commercial/心觅瑜伽馆/DSC00362.jpg',
        '/images/commercial/心觅瑜伽馆/DSC00365.jpg',
        '/images/commercial/心觅瑜伽馆/DSC00368.jpg',
        '/images/commercial/心觅瑜伽馆/DSC00371.jpg',
        '/images/commercial/心觅瑜伽馆/DSC00381-2.jpg',
      ],
    },
    {
      user_id: userId, title: '观乾堂', category: 'commercial', is_featured: false, is_published: true,
      description: '传统中式文化空间，沉稳木色与雅致陈设交相辉映。',
      cover_url: '/images/commercial/观乾堂/DSC04716.jpg',
      tags: ['商业', '中式', '文化', '雅致'],
      photos: [
        '/images/commercial/观乾堂/DSC04716.jpg',
        '/images/commercial/观乾堂/DSC04745.jpg',
        '/images/commercial/观乾堂/DSC04751.jpg',
        '/images/commercial/观乾堂/DSC04778.jpg',
      ],
    },
  ];

  const { data: inserted, error: insertErr } = await supabase
    .from('works')
    .insert(testWorks)
    .select('id, title');

  if (insertErr) {
    return NextResponse.json({ error: `插入失败: ${insertErr.message}` }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `已插入 ${inserted.length} 个真实作品`,
    user: { email: testEmail, password: 'demo123456' },
    works: inserted,
  });
}
