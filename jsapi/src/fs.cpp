// fs.cpp
// HaasUI / QuickJS native module
//
// Usage:
//
// import fs from 'jsfs';
//
// await fs.readdir('/');
// await fs.readFile('/tmp/a.txt');
// await fs.writeFile('/tmp/a.txt', 'hello');
//
// build:
// arm-buildroot-linux-uclibcgnueabihf-g++ \
//     -shared \
//     -fPIC \
//     -static-libstdc++ \
//     -static-libgcc \
//     fs.cpp \
//     -I./quickjs \
//     -o jsfs.so

#include "quickjs.h"

#include <dirent.h>
#include <errno.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

#include <cstdio>
#include <cstdlib>
#include <cstring>

static JSValue make_error(
    JSContext* ctx,
    const char* syscall
) {
    return JS_ThrowInternalError(
        ctx,
        "%s: %s",
        syscall,
        strerror(errno)
    );
}

static JSValue make_resolved_promise(
    JSContext* ctx,
    JSValue value
) {
    JSValue funcs[2];

    JSValue promise = JS_NewPromiseCapability(
        ctx,
        funcs
    );

    JS_Call(
        ctx,
        funcs[0],
        JS_UNDEFINED,
        1,
        (JSValueConst*)&value
    );

    JS_FreeValue(ctx, funcs[0]);
    JS_FreeValue(ctx, funcs[1]);
    JS_FreeValue(ctx, value);

    return promise;
}

static JSValue make_rejected_promise(
    JSContext* ctx,
    JSValue error
) {
    JSValue funcs[2];

    JSValue promise = JS_NewPromiseCapability(
        ctx,
        funcs
    );

    JS_Call(
        ctx,
        funcs[1],
        JS_UNDEFINED,
        1,
        (JSValueConst*)&error
    );

    JS_FreeValue(ctx, funcs[0]);
    JS_FreeValue(ctx, funcs[1]);
    JS_FreeValue(ctx, error);

    return promise;
}

static JSValue fs_readdir(
    JSContext* ctx,
    JSValueConst this_val,
    int argc,
    JSValueConst* argv
) {
    const char* path = JS_ToCString(ctx, argv[0]);

    if (!path)
        return JS_EXCEPTION;

    DIR* dir = opendir(path);

    if (!dir) {
        JS_FreeCString(ctx, path);

        return make_rejected_promise(
            ctx,
            make_error(ctx, "readdir")
        );
    }

    JSValue arr = JS_NewArray(ctx);

    struct dirent* ent;

    uint32_t idx = 0;

    while ((ent = readdir(dir))) {
        if (!strcmp(ent->d_name, "."))
            continue;

        if (!strcmp(ent->d_name, ".."))
            continue;

        JS_SetPropertyUint32(
            ctx,
            arr,
            idx++,
            JS_NewString(ctx, ent->d_name)
        );
    }

    closedir(dir);

    JS_FreeCString(ctx, path);

    return make_resolved_promise(
        ctx,
        arr
    );
}

static JSValue fs_readFile(
    JSContext* ctx,
    JSValueConst this_val,
    int argc,
    JSValueConst* argv
) {
    const char* path = JS_ToCString(ctx, argv[0]);

    if (!path)
        return JS_EXCEPTION;

    FILE* fp = fopen(path, "rb");

    if (!fp) {
        JS_FreeCString(ctx, path);

        return make_rejected_promise(
            ctx,
            make_error(ctx, "readFile")
        );
    }

    fseek(fp, 0, SEEK_END);

    long size = ftell(fp);

    rewind(fp);

    char* buf = (char*)malloc(size);

    if (!buf) {
        fclose(fp);

        JS_FreeCString(ctx, path);

        return make_rejected_promise(
            ctx,
            JS_ThrowOutOfMemory(ctx)
        );
    }

    fread(buf, 1, size, fp);

    fclose(fp);

    JSValue result = JS_NewStringLen(
        ctx,
        buf,
        size
    );

    free(buf);

    JS_FreeCString(ctx, path);

    return make_resolved_promise(
        ctx,
        result
    );
}

static JSValue fs_writeFile(
    JSContext* ctx,
    JSValueConst this_val,
    int argc,
    JSValueConst* argv
) {
    const char* path = JS_ToCString(ctx, argv[0]);

    if (!path)
        return JS_EXCEPTION;

    size_t len;

    const char* data = JS_ToCStringLen(
        ctx,
        &len,
        argv[1]
    );

    if (!data) {
        JS_FreeCString(ctx, path);

        return JS_EXCEPTION;
    }

    FILE* fp = fopen(path, "wb");

    if (!fp) {
        JS_FreeCString(ctx, path);
        JS_FreeCString(ctx, data);

        return make_rejected_promise(
            ctx,
            make_error(ctx, "writeFile")
        );
    }

    fwrite(data, 1, len, fp);

    fclose(fp);

    JS_FreeCString(ctx, path);
    JS_FreeCString(ctx, data);

    return make_resolved_promise(
        ctx,
        JS_UNDEFINED
    );
}

static JSValue fs_unlink(
    JSContext* ctx,
    JSValueConst this_val,
    int argc,
    JSValueConst* argv
) {
    const char* path = JS_ToCString(ctx, argv[0]);

    if (!path)
        return JS_EXCEPTION;

    int ret = unlink(path);

    JS_FreeCString(ctx, path);

    if (ret != 0) {
        return make_rejected_promise(
            ctx,
            make_error(ctx, "unlink")
        );
    }

    return make_resolved_promise(
        ctx,
        JS_UNDEFINED
    );
}

static JSValue fs_stat(
    JSContext* ctx,
    JSValueConst this_val,
    int argc,
    JSValueConst* argv
) {
    const char* path = JS_ToCString(ctx, argv[0]);

    if (!path)
        return JS_EXCEPTION;

    struct stat st;

    if (stat(path, &st) != 0) {
        JS_FreeCString(ctx, path);

        return make_rejected_promise(
            ctx,
            make_error(ctx, "stat")
        );
    }

    JS_FreeCString(ctx, path);

    JSValue obj = JS_NewObject(ctx);

    JS_SetPropertyStr(
        ctx,
        obj,
        "size",
        JS_NewInt64(ctx, st.st_size)
    );

    JS_SetPropertyStr(
        ctx,
        obj,
        "mode",
        JS_NewInt32(ctx, st.st_mode)
    );

    JS_SetPropertyStr(
        ctx,
        obj,
        "mtimeMs",
        JS_NewFloat64(
            ctx,
            (double)st.st_mtime * 1000.0
        )
    );

    JS_SetPropertyStr(
        ctx,
        obj,
        "isFile",
        JS_NewBool(
            ctx,
            S_ISREG(st.st_mode)
        )
    );

    JS_SetPropertyStr(
        ctx,
        obj,
        "isDirectory",
        JS_NewBool(
            ctx,
            S_ISDIR(st.st_mode)
        )
    );

    return make_resolved_promise(
        ctx,
        obj
    );
}

static int jsfs_init(
    JSContext* ctx,
    JSModuleDef* m
) {
    JSValue fs = JS_NewObject(ctx);

    JS_SetPropertyStr(
        ctx,
        fs,
        "readdir",
        JS_NewCFunction(
            ctx,
            fs_readdir,
            "readdir",
            1
        )
    );

    JS_SetPropertyStr(
        ctx,
        fs,
        "readFile",
        JS_NewCFunction(
            ctx,
            fs_readFile,
            "readFile",
            1
        )
    );

    JS_SetPropertyStr(
        ctx,
        fs,
        "writeFile",
        JS_NewCFunction(
            ctx,
            fs_writeFile,
            "writeFile",
            2
        )
    );

    JS_SetPropertyStr(
        ctx,
        fs,
        "unlink",
        JS_NewCFunction(
            ctx,
            fs_unlink,
            "unlink",
            1
        )
    );

    JS_SetPropertyStr(
        ctx,
        fs,
        "stat",
        JS_NewCFunction(
            ctx,
            fs_stat,
            "stat",
            1
        )
    );

    JS_SetModuleExport(
        ctx,
        m,
        "default",
        fs
    );

    return 0;
}

extern "C"
JSModuleDef* js_init_module(
    JSContext* ctx,
    const char* module_name
) {
    JSModuleDef* m = JS_NewCModule(
        ctx,
        module_name,
        jsfs_init
    );

    if (!m)
        return NULL;

    JS_AddModuleExport(
        ctx,
        m,
        "default"
    );

    return m;
}