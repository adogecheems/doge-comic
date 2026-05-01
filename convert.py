#!/usr/bin/env python3
"""
图片/PDF 转 PNG 命令行工具（纯 Python 依赖）
用法: python convert.py <输入目录或PDF文件> <输出目录>
"""

import argparse
import sys
from pathlib import Path

# ---------- 彩色输出 ----------
try:
    import colorama
    colorama.init()
except ImportError:
    pass

RESET = "\033[0m"
BOLD = "\033[1m"
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"

# ---------- 常量 ----------
IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff', '.tif', '.webp', '.ico'}


def colorful_print(color, *args, **kwargs):
    text = " ".join(str(a) for a in args)
    print(f"{color}{text}{RESET}", **kwargs)


def confirm_action(message: str) -> bool:
    colorful_print(CYAN, message, end=" (y/N): ")
    try:
        answer = input().strip().lower()
    except (EOFError, KeyboardInterrupt):
        return False
    return answer in ("y", "yes")


def is_image_file(path: Path) -> bool:
    return path.suffix.lower() in IMAGE_EXTS


def collect_images(directory: Path) -> list[Path]:
    """收集目录下所有图片文件（不递归）"""
    if not directory.is_dir():
        colorful_print(RED, f"错误: {directory} 不是一个目录")
        sys.exit(1)
    return sorted([p for p in directory.iterdir() if p.is_file() and is_image_file(p)])


def convert_image_to_png(src: Path, dst_dir: Path) -> bool:
    """单张图片转 PNG"""
    try:
        from PIL import Image
    except ImportError:
        colorful_print(RED, "缺少依赖 Pillow，请执行: pip install Pillow")
        sys.exit(1)

    dst = dst_dir / f"{src.stem}.png"
    try:
        img = Image.open(src)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")
        img.save(dst, "PNG")
        return True
    except Exception as e:
        colorful_print(RED, f"  转换失败: {src.name} - {e}")
        return False


def convert_pdf_to_png(pdf_path: Path, dst_dir: Path) -> bool:
    """将 PDF 每页转为 PNG (使用 pypdfium2)"""
    try:
        import pypdfium2 as pdfium
    except ImportError:
        colorful_print(RED, "缺少依赖 pypdfium2，请执行: pip install pypdfium2")
        sys.exit(1)

    try:
        pdf = pdfium.PdfDocument(pdf_path)
    except Exception as e:
        colorful_print(RED, f"无法打开 PDF: {e}")
        return False

    total = len(pdf)
    success_count = 0
    for i in range(total):
        page = pdf[i]
        # 渲染为位图，scale 越大图片越清晰，文件也越大
        bitmap = page.render(scale=2)
        pil_image = bitmap.to_pil()
        dst = dst_dir / f"{i+1}.png"
        try:
            pil_image.save(dst, "PNG")
            success_count += 1
        except Exception as e:
            colorful_print(RED, f"  保存第{i+1}页失败: {e}")
    pdf.close()
    return success_count == total


def main():
    parser = argparse.ArgumentParser(
        description="将目录中的图片或 PDF 文件转换为 PNG 格式（纯 Python 实现）",
        epilog="示例: python convert_to_png.py ./images ./output  或  python convert_to_png.py doc.pdf ./pngs"
    )
    parser.add_argument("input", help="输入路径：图片目录 或 PDF 文件")
    parser.add_argument("output", help="输出目录（不存在会自动创建）")
    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    output_dir = Path(args.output).resolve()

    if not input_path.exists():
        colorful_print(RED, f"错误: 输入路径不存在 '{input_path}'")
        sys.exit(1)

    # 处理目录（图片）
    if input_path.is_dir():
        images = collect_images(input_path)
        if not images:
            colorful_print(YELLOW, f"警告: 目录 '{input_path}' 中没有支持的图片文件")
            sys.exit(0)

        colorful_print(CYAN, f"发现 {len(images)} 个图片文件：")
        for img in images:
            print(f"  {img.name}")

        if not confirm_action(f"\n将转换以上 {len(images)} 个文件为 PNG，是否继续？"):
            colorful_print(YELLOW, "操作已取消")
            sys.exit(0)

        output_dir.mkdir(parents=True, exist_ok=True)
        success = 0
        for img in images:
            colorful_print(BOLD, f"转换中: {img.name} -> {img.stem}.png", end=" ")
            if convert_image_to_png(img, output_dir):
                colorful_print(GREEN, "✓")
                success += 1
            else:
                colorful_print(RED, "✗")

        colorful_print(CYAN, f"\n完成: {success}/{len(images)} 个文件成功转换")

    # 处理 PDF 文件
    elif input_path.is_file() and input_path.suffix.lower() == ".pdf":
        colorful_print(CYAN, f"PDF 文件: {input_path.name}")
        if not confirm_action("将把 PDF 每一页转为 PNG，是否继续？"):
            colorful_print(YELLOW, "操作已取消")
            sys.exit(0)

        output_dir.mkdir(parents=True, exist_ok=True)

        if convert_pdf_to_png(input_path, output_dir):
            colorful_print(GREEN, "PDF 所有页面转换成功")
        else:
            colorful_print(RED, "部分页面转换失败，请查看上方错误信息")
    else:
        colorful_print(RED, f"错误: 不支持的文件类型 '{input_path.suffix}'，请提供图片目录或 PDF 文件")
        sys.exit(1)


if __name__ == "__main__":
    main()