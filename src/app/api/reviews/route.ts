import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import { promises as fs } from 'fs';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const reviews = await prisma.customerReview.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let customerName = '';
    let rating = 5;
    let comment = '';
    let imageUrl = '';
    let location = '';
    let isActive = true;

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      customerName = String(form.get('customerName') || '');
      rating = parseInt(String(form.get('rating') || '5')) || 5;
      comment = String(form.get('comment') || '');
      location = String(form.get('location') || '');
      isActive = String(form.get('isActive') || 'true') === 'true';
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
      customerName = body.customerName;
      rating = body.rating || 5;
      comment = body.comment;
      imageUrl = body.imageUrl || '';
      location = body.location || '';
      isActive = body.isActive !== undefined ? body.isActive : true;
    }

    const newReview = await prisma.customerReview.create({
      data: { customerName, rating, comment, imageUrl, location, isActive },
    });

    return NextResponse.json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
