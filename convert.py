#!/usr/bin/env python3
"""
convert.py — 批量将图片 / PDF / ZIP 转为 PNG

支持：
- 目录（递归扫描图片）
- PDF（每页转 PNG）
- ZIP（自动解压后处理）

用法：
  python convert.py <input> [output] [--no-confirm] [-j N]

参数：
  input        输入路径（目录 / PDF / ZIP）
  output       输出目录（默认：输入名）
  --no-confirm 跳过确认
  -j N         并发数（默认：CPU 核心数）

示例：
  convert.py images/
  convert.py images/ out/ -j 8
  convert.py file.zip --no-confirm
  convert.py doc.pdf out
"""

import argparse
import sys
import shutil
import tempfile
import zipfile
import os
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

# ---------- 可选依赖 ----------
try:
    from tqdm import tqdm
except ImportError:
    tqdm = None

# ---------- 彩色输出 ----------
try:
    import colorama
    colorama.init()
except ImportError:
    pass

RESET = "\033[0m"
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"

IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff', '.tif', '.webp', '.ico'}


# ---------- 工具 ----------

def log(color, *args, **kwargs):
    print(f"{color}{' '.join(map(str, args))}{RESET}", **kwargs)


def confirm(msg, auto_yes):
    if auto_yes:
        return True
    log(CYAN, msg, end=" (y/N): ")
    try:
        return input().strip().lower() in ("y", "yes")
    except:
        return False


def is_image(p: Path):
    return p.suffix.lower() in IMAGE_EXTS


def collect_images(root: Path):
    return sorted(p for p in root.rglob("*") if p.is_file() and is_image(p))


# ---------- 转换 ----------

def convert_image(src: Path, dst_dir: Path):
    try:
        from PIL import Image
    except ImportError:
        log(RED, "缺少 Pillow: pip install Pillow")
        sys.exit(1)

    dst = dst_dir / f"{src.stem}.png"
    try:
        with Image.open(src) as img:
            img = img.convert("RGBA" if img.mode in ("RGBA", "P") else "RGB")
            img.save(dst, "PNG")
        return True
    except Exception as e:
        return False


def convert_pdf(pdf_path: Path, dst_dir: Path):
    try:
        import pypdfium2 as pdfium
    except ImportError:
        log(YELLOW, "未安装 pypdfium2，跳过 PDF 支持")
        return False

    try:
        pdf = pdfium.PdfDocument(pdf_path)
    except Exception as e:
        log(RED, "PDF 打开失败:", e)
        return False

    total = len(pdf)
    ok = 0

    iterable = range(total)
    if tqdm:
        iterable = tqdm(iterable, desc="PDF")

    for i in iterable:
        try:
            img = pdf[i].render(scale=2).to_pil()
            img.save(dst_dir / f"{i+1}.png", "PNG")
            ok += 1
        except:
            pass

    pdf.close()
    return ok == total


# ---------- ZIP ----------

def extract_zip(zip_path: Path):
    tmp = Path(tempfile.mkdtemp(prefix="convert_"))
    try:
        with zipfile.ZipFile(zip_path, 'r') as z:
            z.extractall(tmp)
    except Exception as e:
        log(RED, "ZIP 解压失败:", e)
        shutil.rmtree(tmp)
        sys.exit(1)
    return tmp


# ---------- 主逻辑 ----------

def resolve_output(input_path: Path, output):
    if output:
        return Path(output).resolve()
    return Path(input_path.stem if input_path.is_file() else input_path.name).resolve()


def process_images(images, output_dir, workers):
    output_dir.mkdir(parents=True, exist_ok=True)

    success = 0

    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [executor.submit(convert_image, img, output_dir) for img in images]

        iterable = as_completed(futures)
        if tqdm:
            iterable = tqdm(iterable, total=len(futures), desc="Images")

        for f in iterable:
            if f.result():
                success += 1

    log(CYAN, f"完成: {success}/{len(images)}")


def process_directory(input_dir, output_dir, auto_yes, workers):
    images = collect_images(input_dir)

    if not images:
        log(YELLOW, "未找到图片")
        return

    log(CYAN, f"发现 {len(images)} 张图片")

    if not confirm("开始转换？", auto_yes):
        return

    process_images(images, output_dir, workers)


def main():
    parser = argparse.ArgumentParser(
        prog="convert.py",
        description="批量图片/PDF/ZIP 转 PNG"
    )

    parser.add_argument("input")
    parser.add_argument("output", nargs="?")
    parser.add_argument("--no-confirm", action="store_true")
    parser.add_argument("-j", type=int, default=os.cpu_count(), help="并发数")

    args = parser.parse_args()

    input_path = Path(args.input).resolve()

    if not input_path.exists():
        log(RED, "输入不存在")
        sys.exit(1)

    output_dir = resolve_output(input_path, args.output)
    temp_dir = None

    try:
        # ZIP
        if input_path.suffix.lower() == ".zip":
            log(CYAN, "解压 ZIP...")
            temp_dir = extract_zip(input_path)
            process_directory(temp_dir, output_dir, args.no_confirm, args.j)

        # 目录
        elif input_path.is_dir():
            process_directory(input_path, output_dir, args.no_confirm, args.j)

        # PDF
        elif input_path.suffix.lower() == ".pdf":
            if not confirm("转换 PDF？", args.no_confirm):
                return
            output_dir.mkdir(parents=True, exist_ok=True)
            convert_pdf(input_path, output_dir)

        else:
            log(RED, "不支持的输入类型")

    finally:
        if temp_dir:
            shutil.rmtree(temp_dir)


if __name__ == "__main__":
    main()