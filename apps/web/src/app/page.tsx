// 홈 화면 조립. 세 기능(소재·시뮬레이션·캠페인) 진입점. 로직은 modules/에 둔다.
import { Button } from "@/shared/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/Card";

const FEATURES = [
  { title: "소재 생성", description: "AI로 광고 문구와 이미지를 만든다.", href: "/creatives" },
  { title: "성과 예측", description: "집행 전에 소재의 성과를 시뮬레이션한다.", href: "/simulations" },
  { title: "캠페인 집행", description: "승인된 캠페인을 게재하고 최적화한다.", href: "/campaigns" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <h1 className="text-h1">클릭미</h1>
      <p className="mt-2 text-body">광고 소재 생성부터 성과 예측, 캠페인 집행까지 한 번에.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ title, description }) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">시작하기</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
