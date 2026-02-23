import { Card } from "@/components/Card";

export default function MostRead() {
  return (
    <div className="space-y-8">
      <h2 className="text-primary border-secondary mb-8 border-b pb-3 text-2xl font-medium">Mais lidos</h2>
      <ol className="space-y-2">
        <li>
          <Card category="Transporte" url="/post/volvo" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
        </li>
        <li>
          <Card category="Transporte" url="/post/volvo" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
        </li>
        <li>
          <Card category="Transporte" url="/post/volvo" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
        </li>
        <li>
          <Card category="Transporte" url="/post/volvo" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
        </li>
        <li>
          <Card category="Transporte" url="/post/volvo" title="Volvo anuncia novo ciclo bilionário de investimentos e reforça estratégia em ônibus" size="sm" />
        </li>
      </ol>
    </div>
  );
}
