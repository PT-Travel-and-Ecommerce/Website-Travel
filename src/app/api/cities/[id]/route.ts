import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import { promises as fs } from 'fs';

export const runtime = 'nodejs';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let description = '';
    let imageUrl: string | undefined = undefined;

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
        const fromField = String(form.get('imageUrl') || '');
        if (fromField) imageUrl = fromField;
      }
    } else {
      const body = await request.json();
      name = body.name;
      description = body.description || '';
      imageUrl = body.imageUrl;
    }

    const updatedCity = await prisma.city.update({
      where: { id },
      data: {
        name,
        description,
        ...(imageUrl !== undefined ? { imageUrl } : {}),
      },
    });

    return NextResponse.json(updatedCity);
  } catch (error) {
    console.error('Error updating city:', error);
    return NextResponse.json(
      { error: 'Failed to update city' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.city.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting city:', error);
    return NextResponse.json(
      { error: 'Failed to delete city' },
      { status: 500 }
    );
  }
}
