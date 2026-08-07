import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  return handleProxyRequest(request);
}

export async function GET(request: NextRequest) {
  return handleProxyRequest(request);
}

async function handleProxyRequest(request: NextRequest) {
  const targetUrl = 'https://grupomv.frog.mx:9011/sp/REPORTES_API/Lista_Compras_773';

  // 1. Obtener parámetros de fechas del body de la solicitud o query params (Default: 20260101 a 20260131)
  let fechaInicial = '20260101';
  let fechaFinal = '20260131';

  try {
    if (request.method === 'POST') {
      const body = await request.json();
      if (body.fechaInicial) fechaInicial = String(body.fechaInicial).replace(/[^0-9]/g, '');
      if (body.fechaFinal) fechaFinal = String(body.fechaFinal).replace(/[^0-9]/g, '');
    } else {
      const searchParams = request.nextUrl.searchParams;
      if (searchParams.get('fechaInicial')) {
        fechaInicial = String(searchParams.get('fechaInicial')).replace(/[^0-9]/g, '');
      }
      if (searchParams.get('fechaFinal')) {
        fechaFinal = String(searchParams.get('fechaFinal')).replace(/[^0-9]/g, '');
      }
    }
  } catch (e) {
    // Si la lectura del body falla, se usan las fechas por defecto
  }

  // 2. Token de Autorización
  const clientAuth = request.headers.get('authorization');
  const envToken = process.env.ERP_API_TOKEN && process.env.ERP_API_TOKEN !== 'tu_token_aqui' 
    ? process.env.ERP_API_TOKEN 
    : '';

  const rawToken = (clientAuth || envToken || '').trim();
  const apiKey = (request.headers.get('x-api-key') || process.env.ERP_API_KEY || '').trim();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'SuperAppContableGMV/1.0',
  };

  if (rawToken) {
    headers['Authorization'] = rawToken.toLowerCase().startsWith('bearer ') || rawToken.toLowerCase().startsWith('basic ')
      ? rawToken
      : `Bearer ${rawToken}`;
  }

  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  const payload = {
    fechaInicial,
    fechaFinal,
  };

  try {
    // La API de Grupo MV espera POST con JSON Body { fechaInicial, fechaFinal }
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const responseText = await res.text();
    let data: any = null;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = responseText;
    }

    if (!res.ok) {
      let statusDetail = res.statusText;
      if (res.status === 401) {
        statusDetail = 'Token no autorizado o expirado (HTTP 401 Unauthorized). Verifique su token en .env.local';
      } else if (res.status === 500) {
        statusDetail = `Error interno del servidor ERP (HTTP 500). ${typeof data === 'string' ? data : JSON.stringify(data)}`;
      }

      return NextResponse.json(
        { 
          error: `Respuesta de API Grupo MV (Status ${res.status})`,
          details: statusDetail,
          status: res.status,
          sentPayload: payload,
          rawResponse: responseText.slice(0, 500),
        }, 
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      sentPayload: payload,
      count: Array.isArray(data) ? data.length : (data?.data ? data.data.length : 0),
      data: data
    });
  } catch (error: any) {
    console.error('API Proxy Error [Lista_Compras_773]:', error);
    return NextResponse.json(
      { 
        error: 'No se pudo establecer comunicación con el servidor ERP de Grupo MV.',
        message: error?.message || 'Error desconocido'
      }, 
      { status: 500 }
    );
  }
}
