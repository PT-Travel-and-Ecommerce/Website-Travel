import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import { promises as fs } from 'fs';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let description = '';
    let imageUrl = '';

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      name = String(form.get('name') || '');
      description = String(form.get('description') || '');
      const file = form.get('image') as File | null;

      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });
        const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const filename = `${Date.now()}_${safeName}`;
        const outPath = path.join(uploadsDir, filename);
        await fs.writeFile(outPath, buffer);
        imageUrl = `/api/images/${filename}`;
      } else {
        imageUrl = String(form.get('imageUrl') || '');
      }
    } else {
      const body = await request.json();
      name = body.name;
      description = body.description || '';
      imageUrl = body.imageUrl || '';
    }

    const newCity = await prisma.city.create({
      data: { name, description, imageUrl },
    });

    return NextResponse.json(newCity);
  } catch (error) {
    console.error('Error creating city:', error);
    return NextResponse.json(
      { error: 'Failed to create city' },
      { status: 500 }
    );
  }
}
